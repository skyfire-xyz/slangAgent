import { useMemo } from "react";

export default function TaskSource({ skillName }: { skillName: string }) {
  const imageUrl = useMemo(() => {
    if (skillName === "text_completion") {
      return "/images/aichat/logo-chatgpt.svg";
    } else if (skillName === "random_joke") {
      return "/images/aichat/logo-humorapi.svg";
    } else if (skillName === "dataset_search") {
      return "/images/aichat/logo-kaggle.svg";
    } else if (skillName === "image_generation") {
      return "/images/aichat/logo-chatgpt.svg";
    } else if (skillName === "video_search" || skillName === "web_search") {
      return "/images/aichat/logo-gemini.svg";
    }
  }, [skillName]);

  if (!imageUrl) {
    return (
      <div className="mr-2 inline size-6 text-gray-700">
        <span className="inline-block size-6 rounded-sm bg-white text-center text-[12px]">
          {skillName && skillName[0]}
        </span>
      </div>
    );
  }

  return (
    <span className={`mr-4 size-6 shrink-0`}>
      <img
        src={imageUrl}
        alt={skillName}
        className={`inline-block size-6 rounded-sm`}
      />
    </span>
  );
}
