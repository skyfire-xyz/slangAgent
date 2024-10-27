import Markdown from "react-markdown";
import { useTranslations } from "next-intl";
import BodySearch from "./body-search";

export interface ChatWebSearchProps {
  direction: "left" | "right";
  avatarUrl?: string;
  textMessage?: string;
  results: [
    {
      title: string;
      snippet: string;
      link: string;
    },
  ];
}

function ChatWebSearch({
  direction,
  textMessage,
  avatarUrl,
  results,
}: ChatWebSearchProps) {
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
        <BodySearch results={results} />
      </div>
    </div>
  );
}

export default ChatWebSearch;
