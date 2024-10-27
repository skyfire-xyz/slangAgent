import { postChat } from "@/src/redux/thunk-actions";
import { Receiver } from "./type";

const kaggleDatasetSearch = new Receiver({
  typeName: "dataset_search",
  proxyName: "searchDataset",
  sourceName: "KaggleAI",
  logoImageURL: "/images/aichat/logo-kaggle.svg",
  examplePrompt: (
    <>
      <b>Search dataset</b>: baseball
    </>
  ),
  promptHandler: async (inputText, context) => {
    const { dispatch, addMessage, t } = context;
    if (inputText.toLocaleLowerCase().includes("search dataset")) {
      let searchTerm = "";

      const match = inputText.match(/search dataset:(.+)/i);
      if (match) {
        searchTerm = match[1];
      }

      if (!searchTerm) {
        dispatch(
          addMessage({
            type: "chat",
            textMessage: t("aiPrompt.errorMessage"),
          }),
        );
        return true;
      }
      dispatch(
        postChat({
          chatType: "dataset_search",
          data: { prompt: searchTerm.trim() },
        }),
      );
      return true;
    }
    return false;
  },
});

export default kaggleDatasetSearch;
