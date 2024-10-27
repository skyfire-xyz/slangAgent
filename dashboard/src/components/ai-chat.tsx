"use client";

import ChatPanel from "./chat-panel";
import { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import ProtocolLogs from "./protocol-logs/protocol-logs";

type Image = any;
interface AiChatProps {
  images: Image[];
}

export default function AiChat({ images }: AiChatProps) {
  const t = useTranslations("ai");

  const userAvatarImageData = { url: "" };
  const botAvatarImageData = { url: "" };
  const botImageData = { url: "" };

  return (
    <div className="0 h-full flex-grow">
      <div className="container mx-auto h-full rounded-lg shadow-lg">
        <div className="h-full justify-between rounded-lg bg-white sm:flex-col md:flex md:flex-row">
          <ChatPanel
            userImageUrl={
              userAvatarImageData?.url || "/images/aichat/defaultUser.png"
            }
            robotImageUrl={
              botAvatarImageData?.url || "/images/aichat/ai-robot.png"
            }
          />
          <div className="hidden w-2/5 border-l-2 px-5 pt-5 md:block">
            <div className="flex h-full flex-col">
              {/* <img
                src={botImageData?.url || "/images/aichat/ai-robot-flat.png"}
                className="w-240px h-28 rounded-xl object-cover"
                alt=""
              /> */}
              <div> 
              </div>
              <p className="mb-2 mt-4 font-bold">
                <Link
                  href="https://www.oklink.com/amoy/address/0x45c83889BD84D5FB77039B67C30695878f506313/token-transfer"
                  target="_blank"
                >
                  <b>{t("page.titlePaymentLogs")}</b>
                </Link>
              </p>
              <ProtocolLogs />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
