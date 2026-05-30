# Eval loop — status (2026-05-30)

## Done

| Item | Status |
|------|--------|
| GitHub `devOS` main | Eval loop + prompt patches (`d4df984`) |
| Pipecat deploy `flower-bot` | Rolled out; min agents = **1** (warmer) |
| Pipecat secrets | `CEKURA_API_KEY`, `CEKURA_AGENT_ID`, eval loop enabled |
| Post-call → Cekura Observability | Working (e.g. `CAffade…`) |
| Auto eval loop | Scores 3 metrics, patches `master_prompt.md` on failure |
| Cekura agent | Description + Pipecat key synced |
| Scenario | **273084** only — 3 metrics |

## Your 3 metrics

1. Agent Asked What Happened  
2. Agent Asked About Medical Attention  
3. Agent Asked About Legal Representation  

## How to test

1. **Phone (recommended):** Call Twilio → hang up → check **Observability → Calls** → metrics update; prompt auto-patches if failures.  
2. **WebRTC sim:** Cekura → Run scenario 273084 → [latest check 591805](https://dashboard.cekura.ai/5853/results/591805) still showed agent silent (infra path).

## Links

- [Cekura project 5853](https://dashboard.cekura.ai/5853)
- [Scenario 273084 result 591805](https://dashboard.cekura.ai/5853/results/591805)

## Streamlit UI (later)

Eval loop history: `devOS/runtime/eval_loop_history.jsonl` (on server after calls).  
Wire into dashboard in a follow-up — core loop runs without UI.
