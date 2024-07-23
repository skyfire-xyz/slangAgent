import json
import logging
import os
import requests
from openai import OpenAI

logger = logging.getLogger("SlangClient")
BACKEND_HOST_URL = os.getenv("BACKEND_HOST_URL")

class SkyfireAgent:
    def __init__(self, client):
        self.client = client

    def get_headers(self, raw_response):
        claim_id = raw_response.headers.get("skyfire-payment-claim-id", "Unknown")
        amount = raw_response.headers.get("skyfire-payment-amount", "0")
        currency = raw_response.headers.get("skyfire-payment-currency", "USD")
        return claim_id, amount, currency

    def completion(self, prompt: str, model: str, sys_prompt="You are a helpful assistant."):
        """Generate a completion response from the model."""
        try:
            raw_response = self.client.chat.completions.with_raw_response.create(
                model=model,
                messages=[
                    {"role": "system", "content": sys_prompt},
                    {"role": "user", "content": prompt},
                ],
            )
            response = raw_response.parse()
            prompt_tokens = response.usage.prompt_tokens
            completion = response.choices[0].message.content
            completion_tokens = response.usage.completion_tokens

            url = os.getenv("BACKEND_HOST_URL") + "v1/receivers/slang-agent/models/best"
            headers = {
                "skyfire-api-key": os.getenv("SKYFIRE_API_KEY"),
                "content-type": "application/json",
            }
            response_score = requests.get(url, headers=headers)
            cost_data = response_score.json()

            with open("seed/model_costs_seed.json", "r") as file:
                cost_data = json.load(file)

            amount_to_pay = (
                cost_data[model]["inputCost"] * prompt_tokens
                + cost_data[model]["outputCost"] * completion_tokens
            )
            logger.info(f"Raw Response Headers: {raw_response.headers}")
            return completion

        except Exception as e:
            logger.error(f"Error in completion: {e}")
            return None
