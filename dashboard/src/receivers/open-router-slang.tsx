import { postChat } from "@/src/redux/thunk-actions";
import { Receiver } from "./type";

const openRouterSlang = new Receiver({
  typeName: "slang",
  proxyName: "chatSlangOpenRouter",
  sourceName: "OpenRouter",
  logoImageURL: "/images/aichat/logo-openrouter.png",
  examplePrompt: (
    <>
      <b>Slang</b>: drip
    </>
  ),
  promptHandler: async (inputText, context) => {
    const { dispatch, addBotResponseMessage, t } = context;
    if (inputText.toLocaleLowerCase().includes("slang")) {
      let searchTerm = "";

      const match = inputText.match(/slang:(.+)/i);
      if (match) {
        searchTerm = match[1];
      }

      if (!searchTerm) {
        addBotResponseMessage(t("aiPrompt.errorMessage"));
        return true;
      }

      dispatch(
        postChat({
          chatType: "slang",
          data: { prompt: searchTerm.trim() },
        }),
      );
      return true;
    }
    return false;
  },
});

export default openRouterSlang;
