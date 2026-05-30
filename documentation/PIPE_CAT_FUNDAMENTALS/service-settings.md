"""
Table of Contents:
 * # Service Settings
 * ## Overview
 * ## Common Settings
 * ## Service-Specific Settings
 * ## Best Practices
"""

# Service Settings

Configuration options for Pipecat services.

## Overview

Each service in a Pipecat pipeline (STT, LLM, TTS, etc.) has its own set of settings that control its behavior.

## Common Settings

Many services share common settings, such as:
* `api_key`: The authentication key for the service provider.
* `model`: The specific model to use (e.g., `gpt-4`, `deepgram-nova`).

## Service-Specific Settings

Each type of service has unique settings. For example:
* **TTS**: `voice_id`, `sample_rate`, `language`.
* **LLM**: `temperature`, `max_tokens`, `system_instruction`.
* **STT**: `language`, `model`, `callback_url`.

## Best Practices

* **Use Environment Variables**: Never hardcode API keys or sensitive settings.
* **Optimize for Latency**: Choose models and settings that provide the best balance of quality and speed.
* **Test Thoroughly**: Verify that your settings work as expected in different scenarios.
"""
