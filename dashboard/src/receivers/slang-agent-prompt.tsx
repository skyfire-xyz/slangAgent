import { postChat } from "@/src/redux/thunk-actions";
import { Receiver } from "./type";

const slangAgent = new Receiver({
  typeName: "slang",
  proxyName: "chatSlangAgent",
  sourceName: "SlangAgent",
  logoImageURL: "/images/aichat/logo-openrouter.png",
  examplePrompt: (
    <>
      <b>SlangAgent</b>: brb gtg do hw pookie
    </>
  ),
  promptHandler: async (inputText, context) => {
    const { dispatch, addBotResponseMessage, t } = context;
    if (inputText.toLocaleLowerCase().includes("slangagent:")) {
      let searchTerm = "";

      const match = inputText.match(/slangagent:(.+)/i);
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

export default slangAgent;
