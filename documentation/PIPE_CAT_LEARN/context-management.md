# Brief Overview

**Original Link:** https://docs.pipecat.ai/guides/learn/context-management

## Table of Contents

- Context Management
  - Core Components
  - Placement

---

# Context Management

Context refers to the conversation history that the LLM uses to generate responses.

## Core Components
- LLMContext: Stores the list of messages.
- LLMContextAggregatorPair: Manages user and assistant context updates.

## Placement
- User aggregator: After STT service.
- Assistant aggregator: After transport.output().