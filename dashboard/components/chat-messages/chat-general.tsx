import Markdown from "react-markdown";
import fileDownload from "js-file-download";
import { Button } from "flowbite-react";
import { FaRegClipboard } from "react-icons/fa";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface ChatGeneralProps {
  direction: "left" | "right";
  avatarUrl?: string;
  textMessage?: string;
  contentImageUrl?: string;
  children?: React.ReactNode;
}

function ChatGeneral({
  direction,
  textMessage,
  avatarUrl,
  contentImageUrl,
  children,
}: ChatGeneralProps) {
  const t = useTranslations("ai");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textMessage || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

  if (direction === "right") {
    return (
      <div className="mb-4 flex justify-end">
        <div className="mr-2 w-full max-w-[75%] rounded-lg bg-gray-600 px-6 py-4 md:max-w-[80%]">
          <div className="text-xs font-bold text-gray-300 mb-1 flex items-center justify-between">
            <span>You</span>
            <div className="flex items-center">
              {copied && (
                <div className="mr-2 text-xs text-green-500">Copied!</div>
              )}
              <button
                onClick={handleCopy}
                className="ml-2 text-gray-400 hover:text-white"
                title="Copy to clipboard"
              >
                <FaRegClipboard />
              </button>
            </div>
          </div>
          <article className="prose whitespace-pre-wrap text-white">
            <Markdown>{textMessage}</Markdown>
          </article>
        </div>
        <img
          src={avatarUrl}
          className="h-10 w-10 rounded-full object-cover"
          alt=""
        />
      </div>
    );
  }

  return (
    <div className="mb-4 flex justify-start">
      <img
        src={avatarUrl}
        className="h-10 w-10 rounded-full object-cover"
        alt=""
      />
      <div className="ml-2 w-full max-w-[75%] rounded-lg bg-gray-800 px-6 py-4 md:max-w-[80%]">
        <div className="text-xs font-bold text-gray-300 mb-1 flex items-center justify-between">
          <span>SlangAgent</span>
          <div className="flex items-center">
            {copied && (
              <div className="mr-2 text-xs text-green-500">Copied!</div>
            )}
            <button
              onClick={handleCopy}
              className="ml-2 text-gray-400 hover:text-white"
              title="Copy to clipboard"
            >
              <FaRegClipboard />
            </button>
          </div>
        </div>
        <article className="prose whitespace-pre-wrap text-white">
          <Markdown>{textMessage}</Markdown>
        </article>
        {children && <div className="mt-1">{children}</div>}
        {contentImageUrl && (
          <div>
            <img
              src={contentImageUrl}
              className="w-full h-auto mt-4 rounded-lg object-cover"
              alt=""
            />
            <div className="mx-auto mt-2 flex justify-center gap-2">
              <Button
                color="light"
                onClick={() => {
                  fileDownload(contentImageUrl, textMessage + ".png");
                }}
              >
                {t("aiPrompt.btnDownloadImage")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatGeneral;
