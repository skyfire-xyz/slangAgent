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

url = "http://localhost:3000/v1/receivers/slang-agent/models/best"
headers = {
    "skyfire-api-key": skyfire_api_key,
    "content-type": "application/json"
}
numModels = 3
response = requests.get(url, headers=headers)
data = response.json()[:numModels]
modelArray = [
        f"{item['developer']}/{item['model']}"
        for item in data[:numModels]
    ]
# Print the response
print(response.status_code)
print(modelArray)
