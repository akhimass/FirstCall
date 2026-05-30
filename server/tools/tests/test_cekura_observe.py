from __future__ import annotations

from tools import cekura_observe as co


def test_build_cekura_transcript_json_maps_roles_and_skips_greeting_trigger():
    messages = [
        {"role": "system", "content": "You are Aria."},
        {
            "role": "user",
            "content": "The caller has just connected. Open the call now.",
        },
        {"role": "assistant", "content": "Hartley and Associates, this is Aria."},
        {"role": "user", "content": "I was in a car accident."},
    ]

    turns = co.build_cekura_transcript_json(messages)

    assert len(turns) == 2
    assert turns[0]["role"] == "Main Agent"
    assert turns[0]["content"] == "Hartley and Associates, this is Aria."
    assert turns[1]["role"] == "Testing Agent"
    assert turns[1]["start_time"] < turns[1]["end_time"]


def test_send_call_to_cekura_noops_without_credentials(monkeypatch):
    monkeypatch.delenv("CEKURA_API_KEY", raising=False)
    monkeypatch.delenv("CEKURA_AGENT_ID", raising=False)

    result = co.send_call_to_cekura(
        intake_state={"session_id": "abc"},
        messages=[{"role": "user", "content": "Hello"}],
    )

    assert result is None
