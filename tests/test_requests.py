import requests
import json

def test_get_best_response():
    url = 'http://127.0.0.1:5000/v1/receivers/slang-agent'  # Adjust the URL as needed
    headers = {
        'Content-Type': 'application/json'
    }
    data = {
        'prompt': 'What is the meaning of life?'
    }

    response = requests.post(url, headers=headers, data=json.dumps(data))
    print(response.json())
    assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"
    response_data = response.json()
    assert response_data['prompt'] == data['prompt'], f"Expected {data['prompt']} but got {response_data['prompt']}"

if __name__ == '__main__':
    test_get_best_response()
    print("Test passed")