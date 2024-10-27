import { postChat } from "@/src/redux/thunk-actions";
import { Receiver } from "./type";

const chatGPTTasklist = new Receiver({
  typeName: "tasklist",
  proxyName: "tasklist",
  sourceName: "chatGPT",
  logoImageURL: "/images/aichat/logo-chatgpt.svg",
  examplePrompt: (
    <>
      <b>Tasklist</b>: create a fairytale book
    </>
  ),
  promptHandler: async (inputText, context) => {
    const { dispatch, addBotResponseMessage, t } = context;
    if (inputText.toLocaleLowerCase().includes("tasklist")) {
      let searchTerm = "";

      const match = inputText.match(/tasklist:(.+)/i);
      if (match) {
        searchTerm = match[1];
      }

      if (!searchTerm) {
        addBotResponseMessage(t("aiPrompt.errorMessage"));
        return true;
      }

      dispatch(
        postChat({
          chatType: "tasklist",
          data: { prompt: searchTerm.trim() },
        }),
      );
      return true;
    }
    return false;
  },
});

export default chatGPTTasklist;
