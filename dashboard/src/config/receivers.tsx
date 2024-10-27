import imageGeneration from "../receivers/chatgpt-image-generation";
import chatGPTTasklist from "../receivers/chatgpt-tasklist";
import geminiVideoSearch from "../receivers/gemini-video-search";
import geminiWebSearch from "../receivers/gemini-websearch";
import humorAPIRandomJoke from "../receivers/humorapi-joke";
import humorAPIMeme from "../receivers/humorapi-meme";
import kaggleDatasetSearch from "../receivers/kaggle-dataset-search";
import slangAgent from "../receivers/slang-agent-prompt";
import { Receiver } from "../receivers/type";

export const receivers: Receiver[] = [
  kaggleDatasetSearch,
  humorAPIMeme,
  chatGPTTasklist,
  humorAPIRandomJoke,
  imageGeneration,
  geminiVideoSearch,
  geminiWebSearch,
  slangAgent,
];
