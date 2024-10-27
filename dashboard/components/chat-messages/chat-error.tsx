import Markdown from "react-markdown";
import fileDownload from "js-file-download";
import { Button } from "flowbite-react";
import { useTranslations } from "next-intl";
import { RxCrossCircled } from "react-icons/rx";

interface ChatGeneralProps {
  direction: "left" | "right";
  avatarUrl?: string;
  textMessage?: string;
  contentImageUrl?: string;
  children?: React.ReactNode;
}

function ChatError({
  direction,
  textMessage,
  avatarUrl,
  contentImageUrl,
  children,
}: ChatGeneralProps) {
  const t = useTranslations("ai");

  return (
    <div className={`mb-4 flex justify-start`}>
      <img
        src={avatarUrl}
        className="h-10 w-10 rounded-full object-cover"
        alt=""
      />
      <div className="ml-2 max-w-[calc(100%-80px)] rounded-br-3xl rounded-tl-xl rounded-tr-3xl bg-gray-400 px-4 py-3 md:max-w-[400px]">
        <article className="prose text-white">
          <Markdown>{textMessage}</Markdown>
        </article>
      </div>
    </div>
  );
}

export default ChatError;
