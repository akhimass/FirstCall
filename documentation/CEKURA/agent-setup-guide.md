"""
Table of Contents:
 * # Create an Agent
 * # Basic Info
 * ## Agent Description
 * ## Type of Agent
 * ### Single Prompt Agent
 * ### Multi State Agent
 * ### Retell Workflows
 * ### Vapi Workflows
 * # Configuration
 * ## Provider
 * ## Connection
 * ### Voice Connection
 * #### Telephony
 * #### SIP
 * ### Chat Connection
 * #### SMS
 * #### WhatsApp
 * #### WebSocket
 * #### Provider Chat
 * # Additional Settings (Optional)
 * ## Knowledge Base
 * ## Mock Tools
 * ## Dynamic Variables
"""

# Create an Agent

* Go to the Agents section from the left navigation bar.
* Click the Create Agent button in the top right, or if you’re a new user, click Create your first agent in the center of the page.
* Fill in basic info: agent name, language, and description.
* Configure a provider and connection type.

# Basic Info

A label to identify this agent within Cekura. Choose something descriptive so you can easily distinguish it from other agents (e.g. “Support Bot Production” or “Sales Agent v2”).

**Language**

The primary language your agent speaks. Cekura uses this to run simulations and generate evaluators in the correct language.

**Agent Description**

A comprehensive overview of your agent’s purpose, behaviour, and operational guidelines. See the Agent Description section below for details on what to include and how to structure it.

## Agent Description

Agent Description is a comprehensive overview of your voice conversational agent’s purpose, behaviour, and operational guidelines. It encapsulates all the instructions, prompts, and rules you provide to your AI agent.

> By clearly articulating your agent’s description, you enable us to generate automatic, accurate evaluators.

## Type of Agent

### Single Prompt Agent

For Single prompt agents, you can copy the agent’s main prompt here.

### Multi State Agent

If you have multi-state agent, you can build a description in a json structure.
Note - We are very flexible with description so even if you copy paste all your prompts and paste as one huge prompt, we can process. JSON is the recommended approach.

### Retell Workflows

If you have an agent with Retell workflows, you can export the agent’s details as json from Retell.
Go to agents -> select the agent -> click on export button (this will download a .json file) -> copy the content of the file and paste it in agent description field.

### Vapi Workflows

If you have an agent with Vapi workflows, you can export the agent’s details as json from Vapi.
Go to workflows -> select the agent -> click on code button on top right -> copy the content shown and paste it in agent description field.

# Configuration

The Configuration section connects your Cekura agent to the actual AI platform powering it. This is what allows Cekura to simulate calls, run evaluations, and observe live traffic against your real agent.

## Provider

Select the platform your agent is built on. Cekura supports a wide range of providers out of the box, including Custom, LiveKit, Pipecat, ElevenLabs, Chirp, Retell, VAPI, Cisco Webex, Bland AI, Synthflow, Kore.ai, Trillet, Genesys, and Agentforce.

## Connection

Choose how Cekura connects to your agent to run simulations and collect data. The available connection types depend on your agent’s channel — voice or chat.

### Voice Connection

#### Telephony

Connect via a phone number. Cekura will dial your agent directly over the PSTN network, making it the simplest way to test a phone-based voice agent.

#### SIP

Connect via a SIP trunk. Suited for enterprise telephony setups where your agent is reachable through a SIP endpoint rather than a regular phone number.

### Chat Connection

#### SMS

Connect via SMS. Enter the phone number your agent sends and receives chat messages on.

#### WhatsApp

Connect via WhatsApp. Enter the WhatsApp-enabled phone number your agent sends and receives chat messages on. Configure Twilio credentials in Settings → Provider API Keys for WhatsApp integration.

#### WebSocket

WebSocket enables real-time, two-way chat between your agent and the LLM, allowing dynamic and continuous conversation testing. Enter your WebSocket URL (e.g. `wss://your-chatbot-endpoint.com`).

#### Provider Chat

Connect directly through your provider’s native chat interface — no phone number or messaging service required. Provider chat is configured automatically using your voice agent settings.

# Additional Settings (Optional)

## Knowledge Base

Upload reference material your agent uses, so Cekura can generate more accurate evaluators grounded in your content. We support:
* Uploading a document (PDF, TXT, JSON, MD, CSV, XML).
* Connecting an external source (e.g., Google BigQuery or a Website Scraper).

## Mock Tools

Define mock input/output data for tool calls so Cekura can simulate your agent’s tool usage during testing.
* Auto-Fetch: Pulls tool definitions directly from your provider.
* Add Tool manually: Create a mock tool and define its behaviour using JSON.

## Dynamic Variables

Dynamic variables are values injected at call time during scenario generation — letting you parameterise your test scenarios with real-world data like names, addresses, or account IDs instead of hardcoding them.
"""
