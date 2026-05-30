"""Send completed Pipecat calls to Cekura Observability."""

from __future__ import annotations

import os
from typing import Any

import requests

try:
    from loguru import logger
except ImportError:  # pragma: no cover
    import logging

    logger = logging.getLogger(__name__)

CEKURA_OBSERVE_URL = "https://api.cekura.ai/observability/v1/observe/"
_GREETING_TRIGGER_MARKER = "The caller has just connected"


def build_cekura_transcript_json(messages: list[dict[str, Any]] | None) -> list[dict[str, Any]]:
    """Convert LLM context messages to Cekura ``transcript_json`` entries."""

    if not messages:
        return []

    turns: list[dict[str, Any]] = []
    clock = 0.0
    for message in messages:
        role = message.get("role") if isinstance(message, dict) else getattr(message, "role", None)
        content = (
            message.get("content") if isinstance(message, dict) else getattr(message, "content", None)
        )
        if role not in ("user", "assistant") or not isinstance(content, str):
            continue
        text = content.strip()
        if not text or _GREETING_TRIGGER_MARKER in text:
            continue

        cekura_role = "Testing Agent" if role == "user" else "Main Agent"
        duration = max(1.0, min(len(text.split()) * 0.35, 30.0))
        start = clock
        end = clock + duration
        clock = end + 0.2
        turns.append(
            {
                "role": cekura_role,
                "content": text,
                "start_time": round(start, 2),
                "end_time": round(end, 2),
            }
        )
    return turns


def send_call_to_cekura(
    *,
    intake_state: dict[str, Any],
    messages: list[dict[str, Any]] | None,
    call_ended_reason: str = "completed",
) -> dict[str, Any] | None:
    """POST a completed call to Cekura Observability.

    Returns None when credentials are unset (no-op). Otherwise returns the API
    response body or an error-shaped dict.
    """

    api_key = os.getenv("CEKURA_API_KEY", "").strip()
    agent_id_raw = os.getenv("CEKURA_AGENT_ID", "").strip()
    if not api_key or not agent_id_raw:
        return None

    try:
        agent_id = int(agent_id_raw)
    except ValueError:
        logger.warning("[CEKURA] invalid CEKURA_AGENT_ID={!r}", agent_id_raw)
        return {"status": "error", "error": "invalid CEKURA_AGENT_ID"}

    transcript_json = build_cekura_transcript_json(messages)
    if not transcript_json:
        logger.warning("[CEKURA] empty transcript — skipping observability upload")
        return {"status": "skipped", "reason": "empty transcript"}

    session_id = str(intake_state.get("session_id") or "unknown-session")
    payload: dict[str, Any] = {
        "call_id": session_id,
        "agent": agent_id,
        "transcript_type": "cekura",
        "transcript_json": transcript_json,
        "call_ended_reason": call_ended_reason,
    }

    caller_phone = intake_state.get("caller_phone")
    if caller_phone:
        payload["customer_number"] = caller_phone

    metadata = {
        key: intake_state[key]
        for key in (
            "decision",
            "urgency",
            "case_type",
            "severity_tier",
            "attorney_tier",
            "emotional_state",
        )
        if intake_state.get(key) is not None
    }
    if metadata:
        payload["metadata"] = metadata

    try:
        response = requests.post(
            CEKURA_OBSERVE_URL,
            headers={
                "X-CEKURA-API-KEY": api_key,
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=30,
        )
    except requests.RequestException as exc:
        logger.error("[CEKURA] observability upload error call_id={}: {!r}", session_id, exc)
        return {"status": "error", "error": str(exc)}

    if response.ok:
        logger.info("[CEKURA] observability upload ok call_id={}", session_id)
        try:
            return response.json()
        except ValueError:
            return {"status": "ok", "http_status": response.status_code}

    logger.error(
        "[CEKURA] observability upload failed call_id={} status={} body={}",
        session_id,
        response.status_code,
        response.text[:500],
    )
    return {
        "status": "error",
        "http_status": response.status_code,
        "body": response.text[:500],
    }
