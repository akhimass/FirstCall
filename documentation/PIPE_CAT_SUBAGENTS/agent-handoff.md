# Brief Overview

**Original Link:** https://docs.pipecat.ai/subagents/learn/agent-handoff

## Table of Contents

  - How it Works

---

Agent handoff is a critical feature in multi-agent systems. It allows one agent to pass the conversation to another agent when a specific condition is met.

## How it Works

1. **Trigger**: The current agent identifies that a handoff is necessary (e.g., via a tool call).
2. **State Transfer**: Any necessary context or state is passed to the new agent.
3. **Activation**: The new agent takes over the conversation.