import agentops
import os
from agentops.agent import track_agent
from openai import OpenAI
from dotenv import load_dotenv
from agentops import record_function, ActionEvent, record, LLMEvent
import logging


# logging.basicConfig(level=logging.DEBUG)
# logger = logging.getLogger("SlangClient")

load_dotenv()
SKYFIRE_API_KEY = os.getenv("SKYFIRE_API_KEY")
AGENT_OPS_API_KEY = os.getenv("AGENT_OPS_API_KEY")

OPEN_ROUTER = "OpenRouter"



client = OpenAI(
    default_headers={"Skyfire-API-Key": SKYFIRE_API_KEY},
    api_key=SKYFIRE_API_KEY,
    base_url="http://localhost:3000/proxy/openrouter/v1",
)


class SkyfireAgent:
    def __init__(self, client):
        self.client = client

    def completion(
        self, prompt: str, _model: str, sysprompt="You are a helpful assistant."
    ):
        raw_response = client.chat.completions.with_raw_response.create(
            model=_model,
            messages=[
                {"role": "system", "content": sysprompt},
                {"role": "user", "content": prompt},
            ],
        )
        
        response = raw_response.parse()
        return response


skyfire_agent = SkyfireAgent(client)


def getCriteria(prompt: str):
    sysPrompt = "Give a brief rubric (max score of 100) to score the quality of a response to the following message. Respond with just the generic rubric"

    response = skyfire_agent.completion(prompt, "gpt-4o", sysPrompt)
    return response


def getResponses(prompt: str):
    sysPrompt = "In English, write a brief (2 sentences max) conversational response to the prompt. Output just the response."
    models = [
        "anthropic/claude-3.5-sonnet",
        "meta-llama/llama-3-70b-instruct",
        "openai/gpt-4o",
    ]  # TODO: change hardcode

    responses = []

    for model in models:
        response = skyfire_agent.completion(prompt, model, sysPrompt)
        if response is None:
            print(f"Failed to generate response for model ${model}")
            exit()
        responses.append(response)
    return responses 


def main():
    responses = getResponses('how did the chicken cross the road?')
    for response in responses:
        
    

if __name__ == "__main__":
    main()