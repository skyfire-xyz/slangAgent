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

        @track_agent(name=_model)
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
        record(
            ActionEvent(
                action_type="Payment made to OPENROUTER",
                params={
                    "claimID": claimId,
                    "amount": amount,
                    "currency": currency,
                },
                returns="SUCCESS",
            )
        )
        # logger.info('HIEU')
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
    response = skyfire_agent.completion(prompt, "gpt-4o", sysPrompt)
    return response


def getBestModels(numModels: int = 3):
    url = "http://localhost:3000/v1/receivers/slang-agent/models/best"
    headers = {"skyfire-api-key": SKYFIRE_API_KEY, "content-type": "application/json"}
    response = requests.get(url, headers=headers)
    data = response.json()[:numModels]
    modelsArray = [f"{item['developer']}/{item['model']}" for item in data[:numModels]]
    if len(modelsArray) < 3:
        modelsArray = [
            "anthropic/claude-3.5-sonnet",
            "meta-llama/llama-3-70b-instruct",
            "openai/gpt-4o",
        ]
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
    sysPrompt = f"{criteria=}\n{prompt=}\n{responses=}"
    response = skyfire_agent.completion(prompt, "gpt-4o", sysPrompt)
    return response


@record_function("test")
def some_action(message):
    return message
