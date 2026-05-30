"""
Table of Contents:
 * # Bot Implementation (bot.py)
 * ## Overview
 * ## Key Components
 * ### LLM Service
 * ### STT Service
 * ### TTS Service
 * ### Pipeline Configuration
 * ## Event Handlers
 * ### on_client_connected
 * ### on_client_disconnected
"""

# Bot Implementation (bot.py)

This file contains the core logic for the Pipecat-based Twilio chatbot.

## Overview

The bot uses Pipecat's pipeline architecture to process audio in real-time. It integrates with Google Gemini for LLM, Deepgram for STT, and Cartesia for TTS.

## Key Components

### LLM Service
Uses `GoogleLLMService` with system instructions to act as an elementary teacher.

### STT Service
Uses `DeepgramSTTService` for speech-to-text conversion.

### TTS Service
Uses `CartesiaTTSService` with a specific voice ID ("British Reading Lady").

### Pipeline Configuration
The pipeline includes:
* Transport input
* STT
* User aggregator
* LLM
* TTS
* Transport output
* Audio buffer processor
* Assistant aggregator

## Event Handlers

### on_client_connected
Triggered when a user connects. It starts recording and sends an initial introduction message.

### on_client_disconnected
Triggered when the user hangs up. It cancels the pipeline worker and stops the session.
"""
