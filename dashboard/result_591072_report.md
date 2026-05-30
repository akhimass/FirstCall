<!-- CEKURA-REPORT-START -->
# Cekura Quality Report — Lawyer Voice Agent (v1 baseline)

**Result:** v1 baseline — 2026-05-30 18:35 UTC · **591072**  
**Agent:** Lawyer Voice Agent · **18019**  
**Project:** 5853  
**Status:** completed  
**Success rate:** 0%  
**Connection mode:** pipecat-v2 (Pipecat Cloud WebRTC)  
**Scenarios:** 10  

[View in dashboard](https://dashboard.cekura.ai/5853/results/591072)

## Quick Summary

Real **Twilio phone calls may work**, but **Cekura simulated evals still fail**: all 10 runs show **0 seconds of main-agent speech** and end in ~2.5s. The tester says "Hello" → silence → "Are you still there?" → hangup. This blocks the v1→v2→v3 improvement loop until **Pipecat Cloud WebRTC** (Cekura's path) works, not just Twilio WebSocket.

| Issue | Result | Detail |
|---|---|---|
| Agent silent on Cekura WebRTC path | ❌ 10/10 | Infrastructure: no response within 10s |
| Twilio path (manual calls) | ✅ per team | Separate code path in `bot-nemotron.py` |

## Root cause hypothesis

`bot-nemotron.py` has **two transports**:
- **Twilio** → `WebSocketRunnerArguments` (your working phone calls)
- **Cekura** → `SmallWebRTCRunnerArguments` via Daily/Pipecat Cloud (still broken)

Fix is on **Person A** — ensure WebRTC sessions on Pipecat Cloud start the full pipeline (STT/LLM/TTS), not only Twilio.

## Next steps to unlock the eval loop

1. A: Test WebRTC locally — `uv run bot-nemotron.py` → browser at localhost:7860
2. A: Redeploy after WebRTC works locally
3. C: Re-run this report → that becomes **v1 baseline %**
4. B: Fix top failures from report → C runs **v2** → repeat for **v3**

<!-- CEKURA-REPORT-END -->
