import Markdown from "react-markdown";
import fileDownload from "js-file-download";
import { Button } from "flowbite-react";
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
  if (direction === "right") {
    return (
      <div className="mb-4 flex justify-end">
        <div className="mr-2 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl bg-gray-400 px-4 py-3">
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
    <div className={`mb-4 flex justify-start`}>
      <img
        src={avatarUrl}
        className="h-10 w-10 rounded-full object-cover"
        alt=""
      />
      <div className="ml-2 max-w-[calc(100%-80px)] rounded-br-3xl rounded-tl-xl rounded-tr-3xl bg-[#009182] px-4 py-3 md:max-w-[400px]">
        <article className="prose whitespace-pre-wrap text-white">
          <Markdown>{textMessage}</Markdown>
        </article>
        {children && <div className="mt-1">{children}</div>}
        {contentImageUrl && (
          <div>
            <img
              src={contentImageUrl}
              className="w-90 h-90 mt-4 rounded-xl object-cover"
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
