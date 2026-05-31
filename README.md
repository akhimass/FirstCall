# FirstCall

## 1. What Is This?
[60% of law firms are essentially unreachable](https://www.clio.com/resources/legal-trends/2024-report/) by phone — this in a [$61.3 billion industry](https://www.clio.com/blog/personal-injury-law-statistics/) where the average personal injury settlement sits at [$52,900](https://www.clio.com/blog/personal-injury-law-statistics/) and a single missed call is a five-figure case walking to the next firm on the list. FirstCall answers every inbound call immediately and turns the conversation into a structured, qualified case file — no receptionist, no voicemail, no callback lag: ClioClio

1. Collects the accident details, date, state, and fault account
2. Asks about injuries and medical treatment, detecting severity signals like ER visits, surgery, and spine involvement
3. Silently checks the statute of limitations for the caller's state mid-call
4. Classifies the case as minor, moderate, severe, or catastrophic
5. Screens for prior representation and routes to the right attorney tier
6. Captures contact info and builds a prioritized follow-up task queue

By the time the call ends, the firm has a complete intake record, a qualification decision, and a ranked action list, captured at the moment the client was ready to talk. Built on an all-NVIDIA voice pipeline — Parakeet STT, Nemotron-3-Super LLM, Magpie TTS — orchestrated by Pipecat and deployed on Pipecat Cloud, with every call automatically scored against intake quality metrics via Cekura's evaluation loop. When the agent misses a required question, Cekura flags it and the prompt patches itself.

## 2. Demo
[Embed or link to video — under 60 seconds, showing the product in action]

## 3. How We Used Cekura, Nemotron, and Pipecat

### Cekura (Evaluation & Self-Improvement)
1. Goal: Ensure Aria consistently covers the three questions that determine intake quality on every call — whether she asked what happened, asked about medical attention, and asked about prior legal representation.
2. Approach: Every real Twilio call posts its full transcript to Cekura Observability automatically on hangup. Three custom LLM-judge metrics score each call against the intake script. A post-call eval loop (server/tools/eval_loop.py) polls the scores, logs pass/fail to runtime/eval_loop_history.jsonl, and on any failure injects targeted REMINDER blocks directly into prompts/master_prompt.md — no manual copy-paste. We also ran Cekura's simulated WebRTC callers (scenario 273084) as a regression layer, though the live Twilio → Observability path was our authoritative signal during the event.
3. Results: On the first instrumented live call (CAffade…), Cekura scored "Agent Asked What Happened" as pass but flagged "Medical Attention" and "Legal Representation" as fail — Aria empathized but didn't follow through on the required questions. The eval loop automatically patched the prompt and the base prompt was hardened so distressed callers still receive both medical and legal questions via mandatory Stage 2–4 ordering.

### NVIDIA (Open Weights Models)
1. Role as Conversational Brain — Nemotron drives every caller turn: it decides what Aria says next and when to invoke one of four structured tools (check_sol, classify_treatment, route_case, end_call) via function calling. Responses are capped at 200 tokens with temperature 0.4 to keep replies short and consistent for phone intake.
2. All-NVIDIA Speech Pipeline — The full pipeline is Parakeet STT (nemotron-asr-streaming NIM) → Nemotron-3-Super LLM → Magpie TTS (magpie-tts-multilingual NIM), all sharing one NVIDIA_API_KEY over gRPC. This end-to-end NVIDIA stack is the primary deployment path, with Gradium STT/TTS as fallbacks.
3. Multilingual Support — When AGENT_LANGUAGE=multi, Nemotron auto-detects the caller's language from their first words and conducts the entire conversation in that language. It coordinates with the multilingual Parakeet and Magpie NIMs, which support English, Spanish, French, German, and several other languages.
4. Custom TTFB Wrapper — We wrote a thin VLLMOpenAILLMService subclass (nemotron_llm.py) that defers the time-to-first-byte clock stop to the first non-thinking answer token. Without this, stock Pipecat reported ~270ms TTFB on a reasoning model that actually took ~2.2s to produce its first spoken word.

### Pipecat (Voice)
1. Pipeline Assembly — The core pipeline is transport.input() → STT → user_aggregator → LLM → TTS → transport.output() → assistant_aggregator. Pipecat's Pipeline and PipelineWorker manage frame routing, metrics collection, and interruption handling across all components, with Silero VAD handling turn detection and barge-in.
2. Telephony & Transport — Production calls come in via Twilio WebSocket (FastAPIWebsocketTransport); local dev runs via SmallWebRTC at localhost:7860. Twilio delivers 8 kHz µ-law audio — we built an internal resampling stage to upsample to 16 kHz PCM before VAD/STT, since Parakeet requires 16 kHz and silently returns empty transcripts without it. Krisp VIVA noise filtering runs on cloud calls before VAD.
3. Deployment on Pipecat Cloud — The bot is containerized via a Dockerfile based on dailyco/pipecat-base and deployed as flower-bot on Pipecat Cloud, with min_agents=1 to keep a warm instance ready. All secrets (NVIDIA_API_KEY, NEMOTRON_LLM_URL, CEKURA_API_KEY, etc.) are injected via Pipecat Cloud's secret sets, and the Cekura observability upload plus eval loop trigger automatically on every call hangup.

## 4. What We Built During the Hackathon
**Pre-existing:** [What existed before the hackathon]

**Built during the hackathon:**
- [Feature / component 1]
- [Feature / component 2]
- [Feature / component 3]

## 5. Tool Feedback

### Nemotron Feedback
- **What worked well:** [...]
- **What could be improved:** [...]

### Cekura Feedback
- **What worked well:** [...]
- **What could be improved:** [...]
- **Bugs found:** [...]

### Pipecat Feedback (optional)
- **What worked well:** [...]
- **What could be improved:** [...]
