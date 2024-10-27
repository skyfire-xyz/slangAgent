import { postChat } from "@/src/redux/thunk-actions";
import { Receiver } from "./type";

const geminiWebSearch = new Receiver({
  typeName: "web_search",
  proxyName: "websearch",
  sourceName: "Gemini",
  logoImageURL: "/images/aichat/logo-gemini.svg",
  examplePrompt: (
    <>
      <b>WebSearch</b>: national parks
    </>
  ),
  promptHandler: async (inputText, context) => {
    const { dispatch, addBotResponseMessage, t } = context;
    if (inputText.toLocaleLowerCase().includes("websearch")) {
      let searchTerm = "";

      const match = inputText.match(/websearch:(.+)/i);
      if (match) {
        searchTerm = match[1];
      }

      if (!searchTerm) {
        addBotResponseMessage(t("aiPrompt.errorMessage"));
        return true;
      }

      dispatch(
        postChat({
          chatType: "web_search",
          data: { prompt: searchTerm.trim() },
        }),
      );
      return true;
    }
    return false;
  },
});

export default geminiWebSearch;
