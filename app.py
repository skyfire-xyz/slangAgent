from flask import Flask, request, jsonify
import logging
import sys
import os
import src.utils as utils


app = Flask('Slang Agent')
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger('Slang Agent')

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/v1/receivers/slang-agent', methods=['POST'])
def chat_slang_agent():
    chatRequest = request.json
    criteria, allResponses = utils.getCriteria(chatRequest['prompt']), utils.getResponses(chatRequest['prompt'])
    bestResponse = utils.getBestResponse(chatRequest['prompt'], criteria, allResponses)

    chatResponse = {
        'prompt': chatRequest['prompt'],
        'body': bestResponse
    }
    return jsonify(chatResponse)

if __name__ == '__main__':
    app.run(debug=True)

