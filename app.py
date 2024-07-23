import logging

from flask import Flask, jsonify, request

import src.config as config
import src.utils as utils
from src.constants import FAILURE, SUCCESS

app = Flask("Slang Agent")
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("SlangAgent")


@app.route("/v1/receivers/slang-agent", methods=["POST"])
def chat_slang_agent():
    try:
        chatRequest = request.json
        criteria, criteriaCost = utils.getCriteria(chatRequest["prompt"])
        allResponses, modelCosts = utils.getAllModelResponses(chatRequest["prompt"])
        bestModelResponse, gradingCost = utils.getBestResponse(
            chatRequest["prompt"], criteria, allResponses
        )
        paymentPayload = utils.createPaymentPayload(
            SUCCESS, criteriaCost, modelCosts, gradingCost
        )
        chatResponse = utils.createChatResponse(
            prompt=chatRequest["prompt"], body=bestModelResponse, payment=paymentPayload
        )
    except Exception as e:
        logger.error(f"An error occurred: {e}")
        paymentPayload = utils.createPaymentPayload(
            status=FAILURE, criteriaCost=None, modelCosts=None, gradingCost=None
        )
        chatResponse = utils.createChatResponse(
            prompt=chatRequest["prompt"],
            body="An error has occured while processing the request.",
            payment=paymentPayload,
        )

    logger.info(chatResponse)
    return jsonify(chatResponse)


if __name__ == "__main__":
    app.run(debug=True)
