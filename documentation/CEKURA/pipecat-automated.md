"""
Table of Contents:
 * # Overview
 * ## Accessing Test Profile Data in Your Agent
 * ### Session Data Structure
 * ### Accessing Test Profile Fields in Your Agent
 * # Key Terminology
"""

# Overview

Test your Pipecat agents with automated session management. Cekura handles session creation and management automatically.

**No-code Configuration:**
* Provider: Select “Pipecat”.
* Assistant ID: (Optional) Your Pipecat assistant identifier.
* Pipecat Cloud API Key: Your authentication key from Pipecat Cloud.
* Pipecat Agent Name: A descriptive name for your Pipecat agent.
* Agent Configuration (JSON): Additional configuration passed to your Pipecat agent.
* Room Properties (JSON): Configuration for the Daily.co room.

## Accessing Test Profile Data in Your Agent

In the automated flow, Cekura creates the Pipecat session on your behalf. When a test profile is assigned to the scenario, Cekura flattens the test profile fields directly into the Agent Configuration JSON (`SessionParams.data`).

### Session Data Structure

Your agent receives the Agent Configuration JSON via `SessionParams.data`. When a test profile is attached, its fields are merged directly into the config.

### Accessing Test Profile Fields in Your Agent

Since test profile fields are top-level keys, access them directly from the session data. If a test profile key has the same name as an existing config key, the test profile value will override it.

# Key Terminology

* **Pipecat Cloud**: The hosted platform for deploying and managing Pipecat agents.
* **Daily.co**: WebRTC infrastructure provider that powers Pipecat’s voice and video capabilities.
* **Room URL**: The Daily.co WebRTC endpoint where the test session occurs.
* **Meeting Token**: Authentication credential for joining a Daily.co room.
* **Agent Configuration**: JSON payload sent to Pipecat’s start endpoint to configure agent behavior.
* **Room Properties**: Daily.co room settings that control session features and behavior.
"""
