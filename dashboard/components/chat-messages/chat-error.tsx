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
      <div className="ml-2 w-full max-w-[75%] rounded-lg bg-gray-800 px-6 py-4 md:max-w-[80%]">
        <div className="text-xs font-bold text-gray-300 mb-1 flex items-center justify-between"> SlangAgent </div>
        <article className="prose text-white">
          <Markdown>{textMessage}</Markdown>
        </article>
      </div>
    </div>
  );
}

export default ChatError;
