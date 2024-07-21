import os
import requests
import json

# Load environment variables from a .env file if necessary
from dotenv import load_dotenv
load_dotenv()

# Fetch the skyfire-api-key from the environment variables
skyfire_api_key = os.getenv('SKYFIRE_API_KEY')

if not skyfire_api_key:
    raise ValueError("Skyfire API key not found in environment variables")

url = "http://127.0.0.1:5000/v1/receivers/slang-agent"
headers = {
    "skyfire-api-key": skyfire_api_key,
    "content-type": "application/json"
}
data = {
    "prompt": "brb gtg do hw pook"
}

# Make the POST request
response = requests.post(url, headers=headers, data=json.dumps(data))

# Print the response
print(response.status_code)
print(response.json())
