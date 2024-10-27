import { postChat } from "@/src/redux/thunk-actions";
import { Receiver } from "./type";

const openRouterFlirt = new Receiver({
  typeName: "flirt",
  proxyName: "chatTranslateOpenRouter",
  sourceName: "OpenRouter",
  logoImageURL: "/images/aichat/logo-openrouter.png",
  examplePrompt: (
    <>
      <b>Flirt</b>: Greet pretty person
    </>
  ),
  promptHandler: async (inputText, context) => {
    const { dispatch, addBotResponseMessage, t } = context;
    if (inputText.toLocaleLowerCase().includes("flirt")) {
      let searchTerm = "";

      const match = inputText.match(/flirt:(.+)/i);
      if (match) {
        searchTerm = match[1];
      }

      if (!searchTerm) {
        addBotResponseMessage(t("aiPrompt.errorMessage"));
        return true;
      }

      dispatch(
        postChat({
          chatType: "flirt",
          data: {
            situation: searchTerm.trim(),
            sourceLang: "english",
            targetLang: "spanish",
          },
        }),
      );
      return true;
    }
    return false;
  },
});

export default openRouterFlirt;
