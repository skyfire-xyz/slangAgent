import requests
import os
from dotenv import load_dotenv

load_dotenv()
SKYFIRE_API_KEY = os.getenv('SKYFIRE_API_KEY')

# Example URL and data
url = 'https://api.skyfire.xyz/proxy/openrouter/v1/chat/completions'
headers = {
    'Authorization': f'Bearer {SKYFIRE_API_KEY}',  # Ensure correct API key is used
    'Content-Type': 'application/json'
}
data = {
    'model': 'gpt-3.5-turbo',
    'messages': [
        {'role': 'user', 'content': 'What is the meaning of life?'}
    ]
}

# Make the POST request
response = requests.post(url, headers=headers, json=data)
print(response)

# Access the response headers
response_headers = response.headers

# Print specific headers
print("Skyfire Payment Amount:", response_headers.get('skyfire-payment-amount'))
print("Skyfire Payment Claim ID:", response_headers.get('skyfire-payment-claim-id'))
print("Skyfire Payment Currency:", response_headers.get('skyfire-payment-currency'))
print("Skyfire Payment Network:", response_headers.get('skyfire-payment-network'))
print("Skyfire Payment Reference ID:", response_headers.get('skyfire-payment-reference-id'))

# Access the response content
response_content = response.json()
print("Response Content:", response_content)