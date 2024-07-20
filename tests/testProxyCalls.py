import os
from openai import OpenAI
from dotenv import load_dotenv
from agentops import record_function
import logging
import requests


logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger('SlangClient')

load_dotenv()
SKYFIRE_API_KEY = os.getenv('SKYFIRE_API_KEY')
OPEN_AI_API_KEY = os.getenv('OPEN_AI_API_KEY')
AGENT_OPS_API_KEY = os.getenv('AGENT_OPS_API_KEY')

client = OpenAI(
    default_headers={"Skyfire-API-Key": SKYFIRE_API_KEY},
    api_key=OPEN_AI_API_KEY,
    base_url="https://api.skyfire.xyz/proxy/openrouter/v1",
)


class SkyfireAgent:
    def __init__(self, client):
        self.client = client

    def completion(self, prompt: str, _model: str, sysprompt = "You are a helpful assistant."):
        response = client.chat.completions.create(
            model=_model,
            messages=[
                {"role": "system", "content": sysprompt},
                {"role": "user", "content": prompt},
            ],
        )
        custom_headers = response.headers
        logger.info(response)
        return response.choices[0].message.content, custom_headers

skyfire_agent = SkyfireAgent(client)
response, test = skyfire_agent.completion("hello", 'openai/gpt-3.5-turbo')
print(response, '\n', test)

url = 'https://api.skyfire.xyz/proxy/openrouter/v1/chat/completions'
headers = {
    'sky': SKYFIRE_API_KEY,
    'Content-Type': 'application/json'
}
data = {
    'model': 'gpt-3.5-turbo',
    'messages': [
        {'role': 'user', 'content': 'What is the meaning of life?'}
    ]
}

# Make the POST request
response = requests.post(url, headers=headers, json=data)

# Access the response content
response_content = response.json()

print(response_content)