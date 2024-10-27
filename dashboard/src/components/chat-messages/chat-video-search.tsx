import Markdown from "react-markdown";
import { useTranslations } from "next-intl";
import BodyVideos from "./body-videos";

export interface ChatVideoSearchProps {
  direction: "left" | "right";
  avatarUrl?: string;
  textMessage?: string;
  results: [
    {
      title: string;
      link: string;
      description: string;
      thumbnail: {
        static: string;
        rich: string;
      };
    },
  ];
}

function ChatVideoSearch({
  textMessage,
  avatarUrl,
  results,
}: ChatVideoSearchProps) {
  const t = useTranslations("ai");

  return (
    <div className={`mb-4 flex justify-start`}>
      <img
        src={avatarUrl}
        className="h-10 w-10 rounded-full object-cover"
        alt=""
      />
      <div className="ml-2 max-w-[calc(100%-80px)] rounded-br-3xl rounded-tl-xl rounded-tr-3xl bg-[#009182] px-4 py-3">
        <article className="prose text-white">
          <Markdown>{textMessage}</Markdown>
        </article>
        <BodyVideos results={results} />
      </div>
    </div>
  );
}

export default ChatVideoSearch;
