# SlangAgent Example Agent

Welcome to SlangAgent. This agent showcases how to build other agents using the Skyfire proxy.

## Overview

SlangAgent demonstrates the capabilities of the Skyfire proxy, providing developers with a practical example to follow. Now, developers can build agents that can turn a profit with autonomous payments.

## Getting Started

1. **Installation**

   - Clone the repository:
     ```bash
     git clone https://github.com/skyfire-xyz/slangAgent.git
     cd slangAgent
     ```

2. **Skyfire API Key Setup**

   - To create a Skyfire account, send an email to sales@skyfire.xyz. You will receive a link to sign up shortly.
   - After signing up, create an API key from your dashboard.
   - Set the API key as an environment variable in `.env` file:

   ```bash
   SKYFIRE_API_KEY=your_api_key_here
   ```

3.  **Documentation**
     - Access our comprehensive [documentation](https://docs.skyfire.xyz) for detailed guides and API references.

5. **Sample Code**
   
    - Explore the sample code within this repository to see SlangAgent in action.
    - SlangAgent finds the best response to a message with slang by scoring different OpenRouter LLM responses in a rubric.
    - Since the Skyfire proxy is compatible with OpenAI, you can use the OpenAI library and point the base url to Skyfire. This is demonstrated in the file: - [OpenRouter Proxy Configuration](https://github.com/skyfire-xyz/slangAgent/blob/main/src/utils.py)

- Running SlangAgent:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    pip3 install -r requirements.txt
    python3 app.py
    ```

