

from flask import Flask, request, jsonify
import logging
import sys
import os
import src.utils as utils


app = Flask("Slang Agent")
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("Slang Agent")


@app.route("/v1/receivers/slang-agent", methods=["POST"])
def chat_slang_agent():
    chatRequest = request.json
    criteria = utils.getCriteria(chatRequest["prompt"])
    allResponses = utils.getAllModelResponses(chatRequest["prompt"])
    bestResponse = utils.getBestResponse(chatRequest["prompt"], criteria, allResponses)

    chatResponse = {"prompt": chatRequest["prompt"], "body": bestResponse}
    logger.info(chatResponse)
    return jsonify(chatResponse)


if __name__ == "__main__":
    app.run(debug=True)
