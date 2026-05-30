"""
Table of Contents:
 * # Twilio Inbound Chatbot
 * ## How It Works
 * ## Prerequisites
 * ## Setup
 * ## Environment Configuration
 * ## Local Development
 * ## Production Deployment
 * ## Customizing your Bot
 * ## Testing
"""

# Twilio Inbound Chatbot

This project is a Pipecat-based chatbot that integrates with Twilio to handle inbound phone calls via WebSocket connections and provide real-time voice conversations.

## How It Works

When someone calls your Twilio number:
1. **Twilio sends WebSocket messages**: Starts a WebSocket stream to your bot.
2. **Parse the WebSocket messages**: Bot sets up the corresponding Pipecat transport.
3. **(Optional) Look up the caller**: Retrieve custom information using Twilio's REST API.
4. **Bot starts responding**: Pipeline initiates the conversation.

## Prerequisites

* A Twilio account (Account SID, Auth Token, Phone Number).
* API keys for LLM (Google), STT (Deepgram), and TTS (Cartesia).
* Python 3.11+, uv, ngrok, and Docker.

## Setup

1. Clone the repository and navigate to the inbound directory.
2. `uv sync` to install dependencies.
3. `cp env.example .env` and add your API keys.

## Local Development

1. `ngrok http 7860` to start the tunnel.
2. Create a TwiML Bin in Twilio with your ngrok URL.
3. Assign the TwiML Bin to your phone number.
4. `uv run bot.py --transport twilio` to run the bot.

## Production Deployment

Use Pipecat Cloud for production. Update your TwiML Bin to point to `wss://api.pipecat.daily.co/ws/twilio` and include your agent and organization name.

## Customizing your Bot

The `bot.py` file can be configured to look up caller information and personalize the bot's behavior.

## Testing

Use the provided Python or TypeScript clients to test the server via WebSocket without making actual phone calls.
"""
