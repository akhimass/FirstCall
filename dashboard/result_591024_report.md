<!-- CEKURA-REPORT-START -->
# Cekura Quality Report — Lawyer Voice Agent

**Result:** Report — Lawyer Voice Agent (retry flower-bot) · **591024**  
**Agent:** Lawyer Voice Agent · **18019**  
**Project:** 5853  
**Status:** completed  
**Success rate:** 0% (0 / 10 expected outcomes met)  
**Connection mode:** pipecat-v2 (Pipecat Cloud WebRTC)  
**Scenarios:** 10  

[View full results in dashboard](https://dashboard.cekura.ai/5853/results/591024)

## Quick Summary of Issues

Every run failed for the same infrastructure reason: **the Pipecat agent connected but never spoke**. Cekura's tester said "Hello" and got no response within 10 seconds on all 10 calls (~2.5s total duration each, 0s main-agent talk time). This is a deployment/connectivity issue, not a prompt or workflow-quality issue — no intake flow was exercised.

| Issue category | Result | What's going wrong | Affected runs |
|---|---|---|---|
| Agent silent / no response within 10s | ❌ (10 runs) | Pipecat session starts but `flower-bot` produces no audible reply after the tester speaks. Main agent talk time = 0s on every call. | [3199205](https://dashboard.cekura.ai/5853/results/591024?call_id=3199205) through [3199214](https://dashboard.cekura.ai/5853/results/591024?call_id=3199214) |

## Detailed Breakdown

### ❌ Agent silent / infrastructure timeout (10 runs)

Pipecat Cloud reports `flower-bot` as **Ready** with 2 active agents, and Cekura successfully created Pipecat sessions after fixing the agent name. However, the bot never responded to the simulated caller.

#### Run [3199205](https://dashboard.cekura.ai/5853/results/591024?call_id=3199205) — Hesitant Pedestrian Injury Intake
- ❌ Testing Agent: "Hello" → no Main Agent response (00:01)
- ❌ Testing Agent: "Are you still there?" → no Main Agent response (00:12)

*(Same pattern on all 10 runs.)*

## Performance

| Metric | Value | Notes |
|---|---|---|
| Main agent talk time | 0s | All runs |
| Call duration | ~2.2–2.8s | Calls ended before conversation started |
| Infrastructure Issues | Fail (10/10) | "Agent did not respond for over 10 seconds" |
| Latency (p50/p95) | N/A | No agent turns to measure |

## What Works Well

- Cekura ↔ Pipecat Cloud integration is wired correctly after config fix (`pipecat_agent_name: flower-bot`).
- Evaluator generation produced relevant PI-intake scenarios (qualified leads, emotional callers, red-team/time-wasters).
- Pipecat Cloud deployment `flower-bot` shows **Ready** with min 1 / max 10 scaling.

## Next Steps

1. **Verify the deployed bot matches the Cekura agent** — Cekura agent is "Lawyer Voice Agent" but Pipecat deploys `flower-bot` from the hackathon starter (Field & Flower). Confirm you're deploying the correct bot code for your demo.
2. **Check Pipecat Cloud secrets** — run `pc cloud secrets list flower-bot-secrets` and ensure `OPENAI_API_KEY`, `GRADIUM_API_KEY`, etc. are set (`pc cloud secrets set flower-bot-secrets --file .env`).
3. **Smoke-test manually** — `pc cloud agent start flower-bot` and confirm the agent speaks on connect.
4. **Re-run after fix** — rerun result 591024 scenarios or trigger a new `/cekura-report` once the bot responds locally/on cloud.

### Config fix applied during this run

Cekura had `pipecat_agent_name: "agent"` (404 Service not found). Updated to **`flower-bot`** to match Pipecat Cloud org `saibha123`.

<!-- CEKURA-REPORT-END -->
