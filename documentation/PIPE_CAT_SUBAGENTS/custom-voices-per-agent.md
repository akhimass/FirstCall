"""
Table of Contents:
 * # Custom Voices per Agent
 * ## Overview
 * ## Configuration
 * ## Dynamic Voice Switching
 * ## Benefits
"""

# Custom Voices per Agent

Pipecat subagents can each have their own unique voice settings.

## Overview

Giving different agents distinct voices helps users distinguish between them and enhances the conversational experience. For example, a "Billing Specialist" might have a different voice than a "Technical Support" agent.

## Configuration

Each subagent's `TTSService` can be configured independently with its own voice ID, provider, and settings.

## Dynamic Voice Switching

When a handover occurs, the voice automatically changes to the one configured for the active agent.

## Benefits

* **Improved User Experience**: Clearer distinction between different agent roles.
* **Branding**: Use specific voices for different parts of your service.
* **Accessibility**: Choose voices that are most appropriate for the task at hand.
