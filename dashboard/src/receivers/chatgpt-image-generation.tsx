import { postChat } from "@/src/redux/thunk-actions";
import { Receiver } from "./type";

const imageGeneration = new Receiver({
  typeName: "image_generation",
  proxyName: "image",
  sourceName: "chatGPT",
  logoImageURL: "/images/aichat/logo-chatgpt.svg",
  examplePrompt: (
    <>
      <b>Generate image</b>: baby panda
    </>
  ),
  promptHandler: async (inputText, context) => {
    const { dispatch, addBotResponseMessage, t } = context;
    if (
      inputText.toLocaleLowerCase().includes("generate gif") ||
      inputText.toLocaleLowerCase().includes("generate meme") ||
      inputText.toLocaleLowerCase().includes("generate image")
    ) {
      let searchTerm = "";

      let match = inputText.match(/generate image:(.+)/i);
      if (!match) match = inputText.match(/generate gif:(.+)/i);
      if (!match) match = inputText.match(/generate meme:(.+)/i);

      if (match) {
        searchTerm = match[1];
      }

      if (!searchTerm) {
        addBotResponseMessage(t("aiPrompt.errorMessage"));
        return true;
      }

      // Generate Image API
      dispatch(
        postChat({
          chatType: "image_generation",
          data: { prompt: searchTerm.trim() },
        }),
      );
      return true;
    }
    return false;
  },
});

export default imageGeneration;
