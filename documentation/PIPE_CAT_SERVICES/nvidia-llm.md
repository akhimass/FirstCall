# Brief Overview

**Original Link:** https://docs.pipecat.ai/api-reference/server/services/llm/nvidia

## Table of Contents

- NvidiaLLMService
  - Configuration
  - Notes

---

# NvidiaLLMService

NvidiaLLMService provides access to NVIDIA’s NIM language models through an OpenAI-compatible interface. It inherits from OpenAILLMService and supports streaming responses, function calling, and context management.

## Configuration
- api_key: Your NVIDIA API key.
- base_url: Defaults to https://integrate.api.nvidia.com/v1.
- model: Model identifier (e.g., meta/llama-3.3-70b-instruct).

## Notes
- Token reporting: Uses incremental token reporting.
- Reasoning content: Automatically detects and filters reasoning content (e.g., <think> tags).