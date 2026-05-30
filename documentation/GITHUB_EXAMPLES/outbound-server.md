"""
Table of Contents:
 * # Outbound Server (server.py)
 * ## Overview
 * ## Endpoints
 * ### /dialout (POST)
 * ### /twiml (POST)
 * ### /ws (WebSocket)
"""

# Outbound Server (server.py)

Webhook server to handle outbound call requests and initiate calls via Twilio.

## Overview

The server uses FastAPI to manage outbound call triggers and serve TwiML instructions to Twilio.

## Endpoints

### /dialout (POST)
Initiates a call via the Twilio API using the provided `to_number` and `from_number`.

### /twiml (POST)
Served when Twilio connects to the call. It returns TwiML instructions that connect the call to the bot's WebSocket endpoint.

### /ws (WebSocket)
Handles the real-time media stream from Twilio. It passes the connection to the Pipecat bot logic.
"""
