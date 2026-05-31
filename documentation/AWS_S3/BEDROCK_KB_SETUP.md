# AWS Bedrock Knowledge Base — Statute-of-Limitations RAG

The intake agent's `check_sol` tool (`server/tools/sol_lookup.py`) already queries an
**AWS Bedrock Knowledge Base** via `retrieve_and_generate` and falls back to a static
state table when the KB isn't configured. This rounds out the AWS layer: real legal
SoL data instead of a hardcoded table. The code path exists — you just provision the
KB and set two env vars.

## Setup
1. **S3 source bucket** — upload SoL reference docs (per-state filing windows, govt
   notice deadlines, tolling rules). You already have an intake bucket (`INTAKE_S3_BUCKET`);
   use a separate `…-legal-kb` bucket for source material.
2. **Bedrock Knowledge Base** (AWS console → Bedrock → Knowledge bases):
   - Data source = that S3 bucket; embeddings = Titan Embeddings; vector store = the
     default OpenSearch Serverless. Sync the data source.
   - Copy the **Knowledge Base ID**.
3. **Env** (bot / Pipecat Cloud secrets):
   ```
   BEDROCK_KNOWLEDGE_BASE_ID=<kb id>
   BEDROCK_MODEL_ARN=us.anthropic.claude-haiku-4-5-20251001-v1:0   # or any enabled model
   AWS_DEFAULT_REGION=us-east-1
   AWS_ACCESS_KEY_ID=...
   AWS_SECRET_ACCESS_KEY=...
   ```
4. **Verify** which source `check_sol` used:
   ```
   uv run python -c "from tools.sol_lookup import check_sol; \
     print(check_sol(state='CA', accident_date='2024-06-01', plaintiff_age=30, \
     defendant_type='private')['rag_source'])"
   ```
   `bedrock` = live KB; `fallback_table` = KB unset/unreachable (still works).

## Next AWS extension (the "knowledge sub-agent")
The original product vision included researching **treatment paths** (typical
chiropractor/MRI/PT/pain-management journeys by injury type). That's the same pattern:
a second Bedrock KB of medical-treatment references, queried from a `research_treatment`
tool, surfaced as intelligent follow-up questions during Stage 3. The SoL KB above is
the template to copy.
