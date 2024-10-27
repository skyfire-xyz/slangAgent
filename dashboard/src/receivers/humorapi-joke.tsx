import { postChat } from "@/src/redux/thunk-actions";
import { Receiver } from "./type";

const humorAPIRandomJoke = new Receiver({
  typeName: "random_joke",
  proxyName: "joke",
  sourceName: "HumorAI",
  logoImageURL: "/images/aichat/logo-humorapi.svg",
  examplePrompt: null,
  promptHandler: async (inputText, context) => {
    const { dispatch } = context;
    if (inputText.includes("joke")) {
      dispatch(
        postChat({
          chatType: "random_joke",
          data: { searchTerm: "", meme: false },
        }),
      );
      return true;
    }
    return false;
  },
});

export default humorAPIRandomJoke;
