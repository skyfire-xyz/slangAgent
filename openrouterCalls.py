import agentops
import os
from agentops.agent import track_agent
from openai import OpenAI
from dotenv import load_dotenv
from agentops import record_function
import logging
import asyncio


logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("SlangClient")

load_dotenv()
SKYFIRE_API_KEY = os.getenv("SKYFIRE_API_KEY")
OPEN_AI_API_KEY = os.getenv("OPEN_AI_API_KEY")
AGENT_OPS_API_KEY = os.getenv("AGENT_OPS_API_KEY")

OPEN_ROUTER = "OpenRouter"

client = OpenAI(
    default_headers={"Skyfire-API-Key": SKYFIRE_API_KEY},
    api_key=OPEN_AI_API_KEY,
    base_url="https://api.skyfire.xyz/proxy/openrouter/v1",
)


class SkyfireAgent:
    def __init__(self, client):
        self.client = client

    def completion(
        self, prompt: str, _model: str, sysprompt="You are a helpful assistant."
    ):
        response = client.chat.completions.create(
            model=_model,
            messages=[
                {"role": "system", "content": sysprompt},
                {"role": "user", "content": prompt},
            ],
        )
        logger.info(response)
        return response.choices[0].message.content


skyfire_agent = SkyfireAgent(client)


def getCriteria(prompt: str):
    sysPrompt = "Give a brief rubric (max score of 100) to score the quality of a response to the following message. Respond with just the generic rubric"

    response = skyfire_agent.completion(prompt, "gpt-4o", sysPrompt)
    return response


async def getResponses(prompt: str):
    sysPrompt = "In English, write a brief (2 sentences max) conversational response to the prompt. Output just the response."
    models = [
        "anthropic/claude-3.5-sonnet",
        "meta-llama/llama-3-70b-instruct",
        "openai/gpt-4o",
    ]  # TODO: change hardcode

    async def getAResponse(model):
        response = await skyfire_agent.completion(prompt, model, sysPrompt)
        return (
            response if response else f"Failed to generate response for model ${model}"
        )

    responses = await asyncio.gather(*[getAResponse(model) for model in models])
    # TODO: see if needed to concatenate into one string?
    return responses


def main():
    response = skyfire_agent.completion("What is 2+2", "openai/gpt-4o", "assistant")
    print(response)
if __name__ == "__main__":
    main()