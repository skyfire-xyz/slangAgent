import skyfire_sdk
from pprint import pprint
configuration = skyfire_sdk.Configuration(
    host = "https://api.skyfire.xyz"
)
configuration.api_key["ApiKeyAuth"] = ""

with skyfire_sdk.ApiClient(configuration) as api_client:
    api_instance = skyfire_sdk.ChatApi(api_client)
    chatRequest = {
        'messages': [{'role': 'user', 'content': 'what is 2 + 2'}],
        'model': 'anthropic/claude-3.5-sonnet'
    }
    api_response = api_instance.create_open_router_chat_completion_with_http_info(chatRequest)
    pprint(api_response)