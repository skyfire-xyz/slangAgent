import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
GROQ_API_KEY = os.getenv('GROQ_API_KEY')

client = Groq(
    api_key= GROQ_API_KEY
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
        return response.choices[0].message.content


skyfire_agent = SkyfireAgent(client)

def getCriteria(prompt: str):
    sysPrompt = "Give a brief rubric (max score of 100) to score the quality of a response to the following message. Respond with just the generic rubric"

    response = skyfire_agent.completion(prompt, "llama3-70b-8192", sysPrompt)
    return response


print(getCriteria('hey dad, this chicken bussin'))

