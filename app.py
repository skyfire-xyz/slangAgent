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
    try:
        chat_request = request.json
        return chat_request
    except Exception as e:
        logger.error('Error processing request', exc_info=e)
        return jsonify({'error': 'Chat Error'}), 401

if __name__ == '__main__':
    app.run(debug=True)

