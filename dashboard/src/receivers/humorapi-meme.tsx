import { postChat } from "@/src/redux/thunk-actions";
import { Receiver } from "./type";

const humorAPIMeme = new Receiver({
  typeName: "meme",
  proxyName: "joke",
  sourceName: "HumorAI",
  logoImageURL: "/images/aichat/logo-humorapi.svg",
  examplePrompt: (
    <>
      <b>Random image</b>: happy baby
    </>
  ),
  promptHandler: async (inputText, context) => {
    const { dispatch, addBotResponseMessage, t } = context;
    if (
      inputText.toLocaleLowerCase().includes("random gif") ||
      inputText.toLocaleLowerCase().includes("random meme") ||
      inputText.toLocaleLowerCase().includes("random image")
    ) {
      ///////////////////////////////////////////////////////////
      // Meme Request
      ///////////////////////////////////////////////////////////
      let searchTerm = "";

      let match = inputText.match(/random image:(.+)/i);
      if (!match) match = inputText.match(/random gif:(.+)/i);
      if (!match) match = inputText.match(/random meme:(.+)/i);

      if (match) {
        searchTerm = match[1];
      }

      if (!searchTerm) {
        addBotResponseMessage(t("aiPrompt.errorMessage"));
        return true;
      }

      dispatch(
        postChat({
          chatType: "meme",
          data: { searchTerm: searchTerm.trim(), meme: true },
        }),
      );
      return true;
    }
    return false;
  },
});

export default humorAPIMeme;
