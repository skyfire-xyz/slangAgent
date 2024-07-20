from flask import Flask, request, jsonify
import logging


app = Flask('Slang Agent')
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger('Slang Agent')

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/v1/receivers/slang-agent', methods=['POST'])
def get_best_response():
    return jsonify(
            {
            "prompt": "pop off girly pop, you're slayin in that grwm",
            "body": "I scored 3 responses. Yasss queen! Serving looks and confidence like it's nobody's business!",
            "payment": {
                "status": "SUCCESS",
                "sourceName": "hieu",
                "sourceAddress": "0xc0E24Eb8aF398E2d98699D386599708EE4aAEd84",
                "destinationName": "SlangAgent",
                "destinationAddress": "0xb90376944F0fe36Ed005ec20963dB0d04E24058d",
                "amount": "7535",
                "currency": "USDC",
                "generatedDate": "2024-07-20T21:05:28.436Z"
            },
            "quote": [
                {
                "status": "SUCCESS",
                "sourceName": "hieu",
                "sourceAddress": "0xc0E24Eb8aF398E2d98699D386599708EE4aAEd84",
                "destinationName": "SlangAgent",
                "destinationAddress": "0xb90376944F0fe36Ed005ec20963dB0d04E24058d",
                "amount": "7535",
                "currency": "USDC",
                "generatedDate": "2024-07-20T21:05:28.436Z"
                }
            ]
            }
        )

if __name__ == '__main__':
    app.run(debug=True)

