# Brief Overview

**Original Link:** https://docs.pipecat.ai/subagents/introduction

## Table of Contents

  - Core Concepts
    - Subagent
    - Agent Handoff

---

Pipecat Subagents is a framework for building complex, multi-agent voice applications. It allows you to break down a large, complex conversation into smaller, specialized agents that can handle specific tasks or topics.

## Core Concepts

### Subagent
A subagent is a specialized agent that focuses on a specific task or domain. It has its own pipeline, LLM, and tools.

### Agent Handoff
The process of transferring a conversation from one agent to another. This can be triggered by the LLM when it determines that another agent is better suited to handle the user's request.