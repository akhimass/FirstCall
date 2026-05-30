"""
Table of Contents:
 * # Agent Handoff
 * ## Overview
 * ## How it Works
 * ## Implementing Handoff
 * ### 1. Define the Handover Tool
 * ### 2. Handle the Handover Event
 * ### 3. Start the Subagent
 * ## Best Practices
"""

# Agent Handoff

Agent handoff is the mechanism by which control of a conversation is transferred between agents.

## Overview

In a subagent architecture, the coordinator agent often needs to "hand off" the user to a specialized subagent when a specific intent is detected.

## How it Works

1. The **Coordinator** detects that the user wants to perform a task handled by a **Subagent**.
2. The **Coordinator** triggers a handover event.
3. The **Subagent** takes over the conversation, receiving the current context.
4. When the **Subagent** finishes, it can hand control back to the **Coordinator**.

## Implementing Handoff

### 1. Define the Handover Tool

The coordinator should have a tool that, when called by the LLM, initiates the handover.

### 2. Handle the Handover Event

Listen for the tool call in your coordinator's pipeline.

### 3. Start the Subagent

When the handover is triggered, start the subagent's pipeline and connect it to the transport.

## Best Practices

* **Context Transfer**: Ensure relevant information (like user name or intent) is passed to the subagent.
* **Seamless Transition**: Use consistent voices or explain the transition to the user to maintain a good experience.
* **Error Handling**: Have a fallback plan if the subagent fails to start.
