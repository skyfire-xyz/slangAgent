import agentops
import os
from agentops.agent import track_agent
from openai import OpenAI
from dotenv import load_dotenv
from agentops import record_function, ActionEvent, record, LLMEvent
import logging
from datetime import datetime, timezone
import time
import requests
import concurrent.futures
import requests
import re
import json
from flask import abort
import src.config as config

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("SlangClient")

load_dotenv()
SKYFIRE_API_KEY = os.getenv("SKYFIRE_API_KEY")
AGENT_OPS_API_KEY = os.getenv("AGENT_OPS_API_KEY")


client = OpenAI(
    default_headers={"Skyfire-API-Key": SKYFIRE_API_KEY},
    api_key=SKYFIRE_API_KEY,
    base_url="http://localhost:3000/proxy/openrouter/v1",
)


class SkyfireAgent:
    def __init__(self, client):
        self.client = client

    def getHeaders(self, raw_response):
        claimId = raw_response.headers["skyfire-payment-claim-id"]
        amount = raw_response.headers["skyfire-payment-amount"]
        currency = raw_response.headers["skyfire-payment-currency"]
        return claimId, amount, currency

    def completion(
        self, prompt: str, _model: str, sysprompt="You are a helpful assistant."
    ):
        startTime = datetime.fromtimestamp(time.time(), tz=timezone.utc).isoformat(
            timespec="milliseconds"
        )
        raw_response = client.chat.completions.with_raw_response.create(
            model=_model,
            messages=[
                {"role": "system", "content": sysprompt},
                {"role": "user", "content": prompt},
            ],
        )
        agentops.init(AGENT_OPS_API_KEY)
        bufferTime = datetime.fromtimestamp(time.time(), tz=timezone.utc).isoformat(
            timespec="milliseconds"
        )
        buffer = getBufferTime(startTime, bufferTime)
        response = raw_response.parse()

        startLLM_call = (datetime.fromisoformat(startTime) + buffer).isoformat(
            timespec="milliseconds"
        )
        endTime = (
            datetime.fromtimestamp(time.time(), tz=timezone.utc) + buffer
        ).isoformat(timespec="milliseconds")
        prompt_tokens = response.usage.prompt_tokens
        completion = response.choices[0].message.content
        completion_tokens = response.usage.completion_tokens
        
        url = "http://localhost:3000/v1/receivers/slang-agent/models/best"
        headers = {"skyfire-api-key": SKYFIRE_API_KEY, "content-type": "application/json"}
        responseScore = requests.get(url, headers=headers)
        data = responseScore.json()

        modelScore = 0
        for item in data:
            if item['model'] == _model.split('/')[-1]:
                modelScore = item['averageScore']
        modelScore = str(modelScore)[:5]

        @track_agent(name=_model + ': average score is ' + modelScore)
        def createLLM_Event(
            startTime,
            endTime,
            prompt,
            prompt_tokens,
            completion,
            completion_tokens,
            _model,
        ):
            record(
                LLMEvent(
                    init_timestamp=startTime,
                    end_timestamp=endTime,
                    prompt=prompt,
                    prompt_tokens=prompt_tokens,
                    completion=completion,
                    completion_tokens=completion_tokens,
                    model=_model,
                )
            )

        createLLM_Event(
            startLLM_call,
            endTime,
            prompt,
            prompt_tokens,
            completion,
            completion_tokens,
            _model,
        )

        claimId, amount, currency = self.getHeaders(raw_response=raw_response)
        with open('modelCosts.json', 'r') as file:
            data = json.load(file)
        amountToPay = data[_model]['inputCost'] * prompt_tokens + data[_model]["outputCost"] * completion_tokens
        record(
            ActionEvent(
                action_type="Payment made to OPENROUTER",
                params={
                    "model" : _model,
                    "average score": modelScore,
                    "claimID": claimId,
                    "amount paid": amountToPay/1000000,
                    "currency": currency,
                    "input tokens used": prompt_tokens,
                    "input token cost for " + _model: data[_model]['inputCost']/1000000,
                    "output tokens used": completion_tokens,
                    "output token cost for " + _model: data[_model]['outputCost']/1000000,
                    
                },
                returns="SUCCESS",
            )
        )
        logger.info(raw_response.headers)
        return response.choices[0].message.content


skyfire_agent = SkyfireAgent(client)


def getBufferTime(LLM_StartTime, agentOpsStartTime):
    callStart = datetime.fromisoformat(LLM_StartTime)
    agentOpsStart = datetime.fromisoformat(agentOpsStartTime)
    buffer = agentOpsStart - callStart
    return buffer


def getCriteria(sysPrompt: str):
    prompt = "Give a brief rubric with a max score of 100 to score the quality of a response to the following message. Respond with just the generic rubric."
    response = skyfire_agent.completion(prompt, "openai/gpt-4o", sysPrompt)
    return response


def getBestModels(numModels: int = config.slang['models']['numModels']):
    url = "http://localhost:3000/v1/receivers/slang-agent/models/best"
    headers = {"skyfire-api-key": SKYFIRE_API_KEY, "content-type": "application/json"}
    response = requests.get(url, headers=headers)
    data = response.json()[:numModels]
    modelsArray = [f"{item['developer']}/{item['model']}" for item in data[:numModels]]
    if len(modelsArray) < config.slang['models']['numModels']:
        modelsArray = config.slang['models']['default']


    
    return modelsArray


def getOneModelResponse(prompt: str, model: str, sysPrompt: str):
    response = skyfire_agent.completion(prompt, model, sysPrompt)
    if response is None:
        return f"{model}:\nFailed to generate response\n"
    return f"{model}:{response}\n"


def getAllModelResponses(sysPrompt: str):
    prompt = "In English, write a brief (2 sentences max) conversational response to the prompt. Output just the response."
    models = getBestModels()
    responses = ""
    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = {
            executor.submit(getOneModelResponse, prompt, model, sysPrompt): model
            for model in models
        }
        for future in concurrent.futures.as_completed(futures):
            model = futures[future]
            try:
                result = future.result()
                responses += result + "\n\n"
            except Exception as exc:
                print(f"Model {model} generated an exception: {exc}")
                responses += f"{model}:\nError occurred\n"

    return responses


def getBestResponse(prompt: str, criteria: str, responses: str):
    prompt = "Use the criteria to score the responses to the prompt. Display each response from the prompt with its brief criteria scores. At the end, output the response with the highest score. If there is a tie, pick one."
    sysPrompt = f"{criteria=}\n{prompt=}\n{responses=}\n additionally output the model and there scores in the following format as the last line of your response: SCORES [modelName: score, modelName: score, ...]"
    response = skyfire_agent.completion(prompt, "openai/gpt-4o", sysPrompt)

    pattern = r"SCORES.*\[(.*)\]"
    match = re.search(pattern, response)
    if match:
        # Extract the content inside the brackets
        content = match.group(1)

        # Define the regex pattern to extract model names and scores
        model_score_pattern = r"([\w\-\/\.]+):\s*(\d+)"

        # Find all matches in the content
        matches = re.findall(model_score_pattern, content)

        # Print the extracted model names and scores
        for model, score in matches:
            logger.info("SCORES EXTRACTED ", model, " ", score)
            saveModelScore(prompt, score, model, response)
    else:
        logger.info("ERROR SCORES UNABLE TO BE STORED")

    amountToPaySlangAgent = (len(matches)+2)*1007
    record(
        ActionEvent(
            action_type="Payment made to SlangAgent",
            params={
                "amount": amountToPaySlangAgent,
                "currency": 'USDC'
            },
            returns="SUCCESS"
        )
    )

    return response


def saveModelScore(prompt, score, modelName, responsePayload):
    url = "http://localhost:3000/v1/receivers/slang-agent/save-score"
    headers = {"skyfire-api-key": SKYFIRE_API_KEY, "content-type": "application/json"}
    data = {
        "prompt": prompt,
        "score": int(score),
        "modelName": modelName,
        "responsePayload": responsePayload,
    }
    response = requests.post(url, headers=headers, data=json.dumps(data))
