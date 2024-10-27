import { postChat } from "@/src/redux/thunk-actions";
import { Receiver } from "./type";

const geminiVideoSearch = new Receiver({
  typeName: "video_search",
  proxyName: "video",
  sourceName: "Gemini",
  logoImageURL: "/images/aichat/logo-gemini.svg",
  examplePrompt: (
    <>
      <b>VideoSearch</b>: view the eclipse
    </>
  ),
  promptHandler: async (inputText, context) => {
    const { dispatch, addBotResponseMessage, t } = context;
    if (inputText.toLocaleLowerCase().includes("videosearch")) {
      let searchTerm = "";

      const match = inputText.match(/videosearch:(.+)/i);
      if (match) {
        searchTerm = match[1];
      }

      if (!searchTerm) {
        addBotResponseMessage(t("aiPrompt.errorMessage"));
        return true;
      }
      dispatch(
        postChat({
          chatType: "video_search",
          data: { prompt: searchTerm.trim() },
        }),
      );
      return true;
    }
    return false;
  },
});

export default geminiVideoSearch;
