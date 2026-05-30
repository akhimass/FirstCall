"""
Table of Contents:
 * # Introduction
 * ## What are Subagents?
 * ## Key Benefits
 * ## Core Concepts
 * ### Subagent
 * ### Coordinator
 * ### Handover
 * ## Getting Started
"""

# Introduction

Subagents are specialized Pipecat agents that can be coordinated by a main agent to handle specific tasks or domains. This architecture allows for more modular, maintainable, and scalable AI voice applications.

## What are Subagents?

Subagents are independent Pipecat pipelines that focus on a narrow scope of functionality. For example, you might have one subagent for booking appointments, another for technical support, and a third for processing payments.

## Key Benefits

* **Modularity**: Develop and test specific functionalities in isolation.
* **Scalability**: Add new capabilities by simply creating new subagents.
* **Maintainability**: Smaller, focused pipelines are easier to understand and debug.
* **Specialization**: Use different models, prompts, or tools for different tasks.

## Core Concepts

### Subagent

A specialized agent that performs a specific set of tasks. It has its own pipeline, tools, and context.

### Coordinator

The main agent that manages the interaction with the user and coordinates between different subagents. It decides when to hand over control to a subagent and when to take it back.

### Handover

The process of transferring the conversation state and control from the coordinator to a subagent, or vice versa.

## Getting Started

To start using subagents, you'll need to define your specialized agents and then set up a coordinator to manage them. Check out the [Quickstart guide](/subagents/get-started/quickstart) for a step-by-step tutorial.
