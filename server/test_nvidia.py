"""Smoke test for NVIDIA Nemotron endpoints. Run before every demo."""
import os
import time
import asyncio
import websockets
import requests
from dotenv import load_dotenv

load_dotenv()

ASR_URL = os.getenv("NVIDIA_ASR_URL")
LLM_URL = os.getenv("NEMOTRON_LLM_URL")
LLM_MODEL = os.getenv("NEMOTRON_LLM_MODEL")
LLM_API_KEY = os.getenv("NEMOTRON_LLM_API_KEY", "EMPTY")


def test_llm():
    """Hit the Nemotron LLM endpoint with a tiny prompt, measure latency."""
    print(f"\n[LLM] Testing {LLM_URL}")
    print(f"[LLM] Model: {LLM_MODEL}")
    payload = {
        "model": LLM_MODEL,
        "messages": [{"role": "user", "content": "Say 'hi' in one word."}],
        "max_tokens": 20,
        "temperature": 0.1,
        # Mirror the bot: disable Nemotron "thinking" so content (not reasoning) is returned.
        "chat_template_kwargs": {"enable_thinking": False},
    }
    headers = {"Authorization": f"Bearer {LLM_API_KEY}"}
    start = time.time()
    try:
        r = requests.post(
            f"{LLM_URL}/chat/completions",
            json=payload,
            headers=headers,
            timeout=10,
        )
        elapsed = (time.time() - start) * 1000
        if r.status_code == 200:
            content = r.json()["choices"][0]["message"]["content"]
            print(f"[LLM] ✓ OK in {elapsed:.0f}ms — response: {content!r}")
            return True
        else:
            print(f"[LLM] ✗ HTTP {r.status_code}: {r.text[:200]}")
            return False
    except Exception as e:
        print(f"[LLM] ✗ Exception: {e}")
        return False


async def test_asr():
    """Confirm the ASR WebSocket is reachable. Doesn't send audio — just opens."""
    print(f"\n[ASR] Testing {ASR_URL}")
    try:
        async with websockets.connect(ASR_URL, open_timeout=5) as ws:
            print(f"[ASR] ✓ WebSocket connection opened")
            return True
    except Exception as e:
        print(f"[ASR] ✗ Connection failed: {e}")
        return False


if __name__ == "__main__":
    print("=" * 60)
    print("NVIDIA Nemotron Endpoint Smoke Test")
    print("=" * 60)

    llm_ok = test_llm()
    asr_ok = asyncio.run(test_asr())

    print("\n" + "=" * 60)
    print(f"LLM: {'✓ healthy' if llm_ok else '✗ DOWN'}")
    print(f"ASR: {'✓ healthy' if asr_ok else '✗ DOWN'}")
    print("=" * 60)
    print()
    print("If either is down at demo time, flip to bot-gpt.py.")
