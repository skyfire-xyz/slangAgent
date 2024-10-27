import { useMemo } from "react";
import { receivers } from "../config/receivers";

export default function ServiceIcons({ sourceName }: { sourceName: string }) {
  const imageUrl = useMemo(() => {
    let url = "";
    if (sourceName === "HumorAI") {
      url = "/images/aichat/logo-humorapi.svg";
    } else if (sourceName === "KaggleAI") {
      url = "/images/aichat/logo-kaggle.svg";
    } else if (sourceName === "ChatGPT") {
      url = "/images/aichat/logo-chatgpt.svg";
    } else if (sourceName === "Gemini") {
      url = "/images/aichat/logo-gemini.svg";
    }
    receivers.forEach((config) => {
      url = config.sourceName === sourceName ? config.logoImageURL : url;
    });
    return url;
  }, [sourceName]);

  if (!imageUrl) {
    return (
      <div className="mr-2 inline size-4 text-gray-700">
        <span className="inline-block size-4 rounded-sm bg-white text-center text-[12px]">
          {sourceName && sourceName[0]}
        </span>
      </div>
    );
  }

  return (
    <span className={`mr-2 size-4 shrink-0`}>
      <img
        src={imageUrl}
        alt={sourceName}
        className={"inline-block size-4 rounded-sm"}
      />
    </span>
  );
}
