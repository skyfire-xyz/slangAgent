import { useDispatch, useSelector } from "react-redux";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";

import ChatGeneral from "./chat-messages/chat-general";
import { useEffect, useRef, useState } from "react";
import BouncingDotsLoader from "./bouncing-loader";

import { ChatMessageType } from "./types";
import { Button, Modal, TextInput } from "flowbite-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  addInitialMessage,
  addMessage,
  chatSelector,
} from "../redux/reducers/chat-slice"

import ProtocolLogs from "./protocol-logs/protocol-logs"

import { fetchLogoAgent, postChat } from "../redux/thunk-actions";
import {
  setShouldScrollToBottom,
  useShouldScrollToBottomSelector,
} from "../redux/reducers/ui-effect-slice";
import { AppDispatch } from "../redux/store";
import { getLogoAIData, scrollToBottom } from "../utils/ui";
import ChatError from "./chat-messages/chat-error";
import { receivers } from "../config/receivers";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function ChatPane(props: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, status } = useSelector(chatSelector);
  const shouldScrollToBottom = useSelector(useShouldScrollToBottomSelector);

  const t = useTranslations("ai");
  const [inputText, setInputText] = useState("");
  const [showMicroPayments, setShowMicroPayments] = useState(false);

  const chatMessages = useRef<ChatMessageType[]>([]);
  const chatPaneRef = useRef<HTMLDivElement>(null);

  const { robotImageUrl, userImageUrl } = props;

  // Common Utilities
  const addBotResponseMessage = (
    prompt: string,
    data?: any,
    type?: ChatMessageType["type"],
  ) => {
    chatMessages.current = [
      ...chatMessages.current,
      {
        type: type || "chat",
        direction: "left",
        avatarUrl: robotImageUrl,
        textMessage: prompt,
        data,
      },
    ];
  };

  useEffect(() => {
    scrollToBottom([chatPaneRef], () => {
      dispatch(setShouldScrollToBottom(false));
    });
  }, [shouldScrollToBottom]);

  useEffect(() => {
    dispatch(
      addInitialMessage({
        textMessage: t("aiPrompt.defaultGreeting"),
      }),
    );
  }, [messages]);

  // Process User Input
  const handleEnter = async (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === "Enter") {
      dispatch(
        addMessage({
          type: "chat",
          direction: "right",
          avatarUrl: userImageUrl,
          textMessage: inputText,
        }),
      );

      setTimeout(() => {
        chatPaneRef.current?.scrollTo({ top: 99999, behavior: "smooth" });
      }, 100);

      setInputText("");

      // Wait for a little bit to simulate bot thinking
      await sleep(300);

      ///////////////////////////////////////////////////////////
      // Receivers prompt handling
      ///////////////////////////////////////////////////////////
      const handled = await Promise.all(
        receivers.map(
          async (config) =>
            await config.promptHandler(inputText, {
              dispatch,
              addBotResponseMessage,
              addMessage,
              t,
            }),
        ),
      );
      if (handled.includes(true)) return;

      ///////////////////////////////////////////////////////////
      // Regular Chat Request
      ///////////////////////////////////////////////////////////
      // dispatch(
      //   postChat({
      //     chatType: "chat",
      //     data: {
      //       prompt: inputText,
      //     },
      //   }),
      // );

      if (ev.preventDefault) ev.preventDefault();
    }
  };

  return (
    <div className="flex size-full flex-col justify-between">
      <div
        id="chat-pane"
        className="mt-5 flex grow flex-col overflow-scroll px-5 "
        ref={chatPaneRef}
      >
        {messages &&
          messages.map((message: ChatMessageType, index: number) => {
            if (message.type === "error") {
              return (
                <ChatError
                  key={index}
                  direction={message.direction}
                  avatarUrl={message.avatarUrl}
                  textMessage={message.textMessage}
                />
              );
            }
            return (
              <ChatGeneral
                key={index}
                direction={message.direction}
                avatarUrl={message.avatarUrl}
                textMessage={message.textMessage}
                contentImageUrl={message.data}
              />
            );
          })}

        {status.botThinking && (
          <ChatGeneral direction="left" avatarUrl={robotImageUrl}>
            <BouncingDotsLoader />
          </ChatGeneral>
        )}
      </div>
      <div className="flex-none px-3 py-5 pt-1 md:pt-5">
        <div className="mb-2 flex justify-end md:hidden">
          <HiOutlineCurrencyDollar
            className="size-5"
            onClick={() => setShowMicroPayments(true)}
          />
        </div>
        <TextInput
          className="w-full rounded-xl bg-[#f7f9fa]"
          placeholder={t("page.chatPlaceholder")}
          value={inputText}
          onChange={(ev) => {
            setInputText(ev?.target?.value);
          }}
          onKeyDown={handleEnter}
        ></TextInput>
      </div>
      <Modal
        show={showMicroPayments}
        onClose={() => setShowMicroPayments(false)}
      >
        <Modal.Header>
          <Link href="https://www.oklink.com/amoy/address/0x45c83889BD84D5FB77039B67C30695878f506313/token-transfer">
            {t("page.titlePaymentLogs")}
          </Link>
        </Modal.Header>
        <Modal.Body>
          <ProtocolLogs />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowMicroPayments(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
