<!-- CEKURA-REPORT-START -->
# Cekura Quality Report — Lawyer Voice Agent

**Result:** Post-call retest — 2026-05-30 20:19 UTC · **591306**  
**Agent:** Lawyer Voice Agent · **18019**  
**Project:** 5853  
**Status:** completed  
**Success rate:** 0.0% (0/10)  
**Connection mode:** pipecat-v2 (Pipecat Cloud WebRTC)  
**Scenarios:** 10  
**Main agent spoke in:** 0/10 runs  

[View in dashboard](https://dashboard.cekura.ai/5853/results/591306)

## Quick Summary

All runs failed with **zero main-agent speech** — same WebRTC infra blocker as prior reports. Your live Twilio call may work, but Cekura simulated evals still can't reach the agent over Pipecat WebRTC.

| Issue category | Result | What's going wrong | Affected runs |
|---|---|---|---|
| Agent silent on WebRTC | ❌ (10 runs) | No response within eval timeout (~2–3s calls). | [All runs](https://dashboard.cekura.ai/5853/results/591306) |

## Detailed Breakdown

### ❌ Failed runs (10)

#### Run [3199863](https://dashboard.cekura.ai/5853/results/591306?call_id=3199863) — Emotional Distress, No Accident Lawsuit
- ❌ "Testing Agent: Hello"

#### Run [3199862](https://dashboard.cekura.ai/5853/results/591306?call_id=3199862) — Evasive Caller: Vague Accident Details
- ❌ "Testing Agent: Hello"

#### Run [3199861](https://dashboard.cekura.ai/5853/results/591306?call_id=3199861) — Property Line Dispute Stress
- ❌ "Testing Agent: Hello"

#### Run [3199860](https://dashboard.cekura.ai/5853/results/591306?call_id=3199860) — Complex Pileup Concussion Protocol
- ❌ "Testing Agent: Hello"

#### Run [3199859](https://dashboard.cekura.ai/5853/results/591306?call_id=3199859) — Slip-and-Fall Orthopedic Consultation
- ❌ "Testing Agent: Hello"

#### Run [3199858](https://dashboard.cekura.ai/5853/results/591306?call_id=3199858) — Rear-end Whiplash Consultation Booking
- ❌ "Testing Agent: Hello"

#### Run [3199857](https://dashboard.cekura.ai/5853/results/591306?call_id=3199857) — Motorcyclist Accident: Prior Contact
- ❌ "Testing Agent: Hello"

#### Run [3199856](https://dashboard.cekura.ai/5853/results/591306?call_id=3199856) — Truck Accident Statute of Limitations
- ❌ "Testing Agent: Hello"

#### Run [3199855](https://dashboard.cekura.ai/5853/results/591306?call_id=3199855) — Distraught Caller: Systematic Intake Under Duress
- ❌ "Testing Agent: Hello"

#### Run [3199854](https://dashboard.cekura.ai/5853/results/591306?call_id=3199854) — Hesitant Pedestrian Injury Intake
- ❌ "Testing Agent: Hello"

## Next Steps

1. Fix Pipecat Cloud WebRTC if agent_spoke=0 (browser test).
2. Iterate prompt with Person B if agent spoke but outcomes failed.
3. Set up Cekura observability to ingest real Twilio call logs separately.

<!-- CEKURA-REPORT-END -->