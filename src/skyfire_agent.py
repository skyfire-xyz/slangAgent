import logging

logger = logging.getLogger("SlangClient")


class SkyfireAgent:
    def __init__(self, client):
        self.client = client

    def completion(
        self, prompt: str, model: str, sys_prompt="You are a helpful assistant."
    ):
        """Generate a completion response from the model."""
        try:
            raw_response = self.client.chat.completions.with_raw_response.create(
                model=model,
                messages=[
                    {"role": "system", "content": sys_prompt},
                    {"role": "user", "content": prompt},
                ],
            )
            cost = int(raw_response.headers["skyfire-payment-amount"])
            response = raw_response.parse()
            return response.choices[0].message.content, cost

        except Exception as e:
            logger.error(f"Error in completion: {e}")
            return None
