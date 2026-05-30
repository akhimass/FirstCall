# Brief Overview

**Original Link:** https://docs.pipecat.ai/pipecat/learn/function-calling

## Table of Contents

- Function Calling
  - Implementation
  - Handler Structure
- Process data

---

# Function Calling

Function calling (also known as tool calling) allows LLMs to request information from external services and APIs during conversations.

## Implementation
1. Define Functions: Use FunctionSchema or direct functions.
2. Register Handlers: Use register_function or register_direct_function.
3. Create Pipeline: Include LLM service in the pipeline.

## Handler Structure
Every function handler receives a FunctionCallParams object.
```python
async def my_handler(params: FunctionCallParams):
    # Process data
    await params.result_callback(result)
```