import agentops
import os
from agentops.agent import track_agent
from openai import OpenAI
from dotenv import load_dotenv
from agentops import record_function

load_dotenv()
SKYFIRE_API_KEY = os.getenv('SKYFIRE_API_KEY')
OPEN_AI_API_KEY = os.getenv('OPEN_AI_API_KEY')
AGENT_OPS_API_KEY = os.getenv('AGENT_OPS_API_KEY')

agentops.init(AGENT_OPS_API_KEY)



# Initialize OpenAI client

client = OpenAI(
    default_headers={"Skyfire-API-Key": SKYFIRE_API_KEY},
    api_key=OPEN_AI_API_KEY,
    base_url="https://api.skyfire.xyz/proxy/openrouter/v1",
)


@track_agent(name="skyfire")
class SkyfireAgent:
    def completion(self, prompt: str):
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "What is the meaning of life?"},
            ],
        )
        
        return completion.choices[0].message.content
    


skyfire = SkyfireAgent()
meaningOfLife = skyfire.completion(
    "What is the meaning of life?"
)
print(meaningOfLife)



agentops.end_session('Success')


