import concurrent.futures
import json
import logging
import os
import re

import requests
from dotenv import load_dotenv
from openai import OpenAI

import src.config as config
from src.constants import SLANG_AGENT
from src.skyfire_agent import SkyfireAgent

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("SlangClient")

load_dotenv()
SKYFIRE_API_KEY = os.getenv("SKYFIRE_API_KEY")
BACKEND_HOST_URL = os.getenv("BACKEND_HOST_URL")

if not SKYFIRE_API_KEY or not BACKEND_HOST_URL:
    logger.error("Missing environment variables: SKYFIRE_API_KEY or BACKEND_HOST_URL")
    raise EnvironmentError("Required environment variables are missing")

# Initialize the OpenAI client with custom settings.
# - `default_headers` sets the Skyfire API key for authentication.
# - `api_key` provides the API key for the OpenAI service.
# - `base_url` defines the base URL for accessing the OpenAI API through the Skyfire proxy.
client = OpenAI(
    default_headers={"Skyfire-API-Key": SKYFIRE_API_KEY},
    api_key=SKYFIRE_API_KEY,
    base_url=BACKEND_HOST_URL + "proxy/openrouter/v1",
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


def getBestModels(numModels: int = config.slang["models"]["num"]):
    url = BACKEND_HOST_URL + "v1/receivers/slang-agent/models/best"
    headers = {
        "skyfire-api-key": SKYFIRE_API_KEY,
        "content-type": "application/json",
    }
    response = requests.get(url, headers=headers)
    data = response.json()[:numModels]
    models = [f"{item['developer']}/{item['model']}" for item in data[:numModels]]
    if len(models) < numModels:
        models = config.slang["models"]["default"]
    return models


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
    models = getBestModels()
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


def saveOneModelScore(prompt, score, modelName, responsePayload):
    try:
        url = BACKEND_HOST_URL + "v1/receivers/slang-agent/save-score"
        headers = {
            "skyfire-api-key": SKYFIRE_API_KEY,
            "content-type": "application/json",
        }
        data = {
            "prompt": prompt,
            "score": int(score),
            "modelName": modelName,
            "responsePayload": responsePayload,
        }
        response = requests.post(url, headers=headers, data=json.dumps(data))
        response.raise_for_status()
    except Exception as e:
        logger.error(f"Error saving model score: {e}")


def saveAllModelScores(prompt, response):
    pattern = r"SCORES.*\[(.*)\]"
    match = re.search(pattern, response)
    if match:
        content = match.group(1)
        model_score_pattern = r"([\w\-\/\.]+):\s*(\d+)"
        matches = re.findall(model_score_pattern, content)
        for model, score in matches:
            logger.info(f"Assigned score {score} to model: {model}")
            saveOneModelScore(prompt, score, model, response)
    else:
        raise ValueError("Error: Unable to extract scores from the response.")


def getBestResponse(prompt: str, criteria: str, responses: str):
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

    saveAllModelScores(prompt, response)
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


def getTokensFromResponse(response):
    return response.usage.prompt_tokens, response.usage.completion_tokens


def loadSeededModelCosts():
    with open("seed/model_costs_seed.json", "r") as file:
        return json.load(file)


def calculateCostFromTokens(costData, model, promptTokens, completionTokens):
    return (
        costData[model]["inputCost"] * promptTokens
        + costData[model]["outputCost"] * completionTokens
    )
