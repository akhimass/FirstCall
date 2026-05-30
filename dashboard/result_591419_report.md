<!-- CEKURA-REPORT-START -->
# Cekura Quality Report — Lawyer Voice Agent

**Result:** Self-improve run — Traumatic Florida Accident Call · **591419**  
**Agent:** Lawyer Voice Agent · **18019**  
**Project:** 5853  
**Status:** completed  
**Success rate:** 0.0% (0/1)  
**Connection mode:** pipecat-v2 (Pipecat Cloud WebRTC)  
**Scenarios:** 1  
**Main agent spoke in:** 0/1 runs  

[View in dashboard](https://dashboard.cekura.ai/5853/results/591419)

## Observability note (live Twilio calls)

The only call in **Observability → Calls** right now is an API verification upload (`test-cursor-verify-002`), not your live Twilio session. If you called after the latest redeploy and still see nothing under Observability, check Pipecat logs for `[CEKURA] observability upload ok` on hangup.

## Quick Summary

Latest Cekura test run (**591419**) failed: **main agent never spoke** (0s talk time, ~7s call). Tester heard only “Are you still there?” twice — same WebRTC / agent-silent pattern as larger batch runs.

| Issue category | Result | What's going wrong | Affected runs |
|---|---|---|---|
| Agent silent on WebRTC | ❌ (1 run) | Main agent talk time = 0s; no greeting or intake questions. | [3200357](https://dashboard.cekura.ai/5853/results/591419?call_id=3200357) |
| Expected outcome | ❌ | Accident, injuries, and case determination never addressed (agent silent). | [3200357](https://dashboard.cekura.ai/5853/results/591419?call_id=3200357) |

## Run details

### ❌ Run [3200357](https://dashboard.cekura.ai/5853/results/591419?call_id=3200357) — Traumatic Florida Accident Call

**Scenario:** Chatty Narrator · Default Test Profile  
**Duration:** ~6.85s (audio)  
**Evaluation status:** failure  

**Expected outcome failures:**
- ❌ The main agent did not speak or ask about the accident.
- ❌ The main agent did not speak or inquire about the caller's injuries.
- ❌ The main agent did not speak or make any case determination.

**Transcript (testing agent only):**
- Testing Agent: "Are you still there?" (×2)

**Key metrics:**
| Metric | Score | Note |
|---|---|---|
| Talk Ratio | 0.0 | Main Agent: **0 seconds** |
| Expected Outcome | 0 | All checklist items failed |
| Infrastructure Issues | pass | Audio check: no infra flag (agent silence is behavioral/connection) |
| Latency | n/a | No agent turns |

## Comparison (previous run)

Result **[591416](https://dashboard.cekura.ai/5853/results/591416)** (1 min earlier) on the same scenario had **~3.8s main-agent audio** (talk ratio 0.17) — agent partially responded before failing outcome checks. Latest run regressed to full silence.

## Next steps

1. **WebRTC / Pipecat Cloud:** Confirm `flower-bot` responds in Cekura “Run test” (WebRTC) before relying on Twilio-only validation.
2. **Observability:** After a Twilio call, confirm `[CEKURA]` upload lines in `pipecat cloud agent logs flower-bot` and a new row under Observability → Calls.
3. **Prompt / intake:** Once agent speaks in sims, re-run scenario 272944 and expand batch evals.

<!-- CEKURA-REPORT-END -->
