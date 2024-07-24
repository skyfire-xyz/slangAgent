import concurrent.futures
import json
import logging
import os

from dotenv import load_dotenv
from openai import OpenAI

import src.config as config
from src.constants import SLANG_AGENT
from src.skyfire_agent import SkyfireAgent

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("SlangClient")

load_dotenv()
SKYFIRE_API_KEY = os.getenv("SKYFIRE_API_KEY")

if not SKYFIRE_API_KEY:
    logger.error("Missing environment variable: SKYFIRE_API_KEY")
    raise EnvironmentError("Required environment variables are missing")

# Initialize the OpenAI client with custom settings.
# - `default_headers` sets the Skyfire API key for authentication.
# - `api_key` provides the API key for the OpenAI service.
# - `base_url` defines the base URL for accessing the OpenAI API through the Skyfire proxy.
client = OpenAI(
    default_headers={"Skyfire-API-Key": SKYFIRE_API_KEY},
    api_key=SKYFIRE_API_KEY,
    base_url="https://api.skyfire.xyz/proxy/openrouter/v1",
)


skyfire_agent = SkyfireAgent(client)


def getCriteria(prompt: str):
    sysPrompt = (
        "Give a brief rubric with a max score of 100 to score the"
        " quality of a response to the following message. Respond with just the generic rubric."
    )
    gradingModel = config.slang["models"]["grader"]
    response, cost = skyfire_agent.completion(prompt, gradingModel, sysPrompt)
    return response, cost


def getOneModelResponse(prompt: str, model: str, sysPrompt: str):
    response, cost = skyfire_agent.completion(prompt, model, sysPrompt)
    if response is None:
        return f"Error: Failed to generate response from model: {model}."
    return f"{model}:{response}\n", cost


def getAllModelResponses(prompt: str):
    sysPrompt = (
        "In English, write a brief (2 sentences max) conversational"
        " response to the prompt. Output just the response."
    )
    models = config.slang["models"]["default"]
    responses = ""
    costs = {}

    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = {
            executor.submit(getOneModelResponse, prompt, model, sysPrompt): model
            for model in models
        }

        for future in concurrent.futures.as_completed(futures):
            model = futures[future]
            try:
                response, cost = future.result()
                responses += response + "\n\n"
                costs[model] = cost
            except Exception as exc:
                print(f"Model {model} generated an exception: {exc}")
                responses += f"{model}:\nError occurred\n"
                costs[model] = None

    logger.info(f"Model costs: {costs}")
    return responses, costs


def getScoredResponses(prompt: str, criteria: str, responses: str):
    sysPrompt = (
        "Use the criteria to score the responses to the prompt. At the end, "
        "output just the response with the highest score. If there is a tie, pick one. "
        f"Output format: 'I scored {config.slang['models']['num']} responses.\n'"
        "[insert best response here without model names]'\n"
    )
    prompt = (
        f"{criteria=}\n{prompt=}\n{responses=}\n additionally output the model"
        " and there scores in the following format as the last line of your response:"
        " SCORES [modelName: score, modelName: score, ...]"
    )
    gradingModel = config.slang["models"]["grader"]
    response, cost = skyfire_agent.completion(prompt, gradingModel, sysPrompt)

    return response, cost


def createPaymentPayload(status: str, criteriaCost, modelCosts, gradingCost):
    totalCost = (
        criteriaCost
        + gradingCost
        + sum(cost for cost in modelCosts.values() if cost is not None)
    )
    return {
        "status": status,
        "destinationName": SLANG_AGENT,
        "amount": f"{totalCost:.5g}",
        "currency": "USDC",
    }


def createChatResponse(prompt: str, body: str, payment: dict):
    return {
        "prompt": prompt,
        "body": body,
        "payment": payment,
    }
