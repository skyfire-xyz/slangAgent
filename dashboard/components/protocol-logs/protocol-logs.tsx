import { useEffect, useRef } from "react";
import { PaymentType } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";

import {
  setShouldScrollToBottom,
  useShouldScrollToBottomSelector,
} from "../../redux/reducers/ui-effect-slice";
import { AppDispatch } from "@/redux/store";

import { scrollToBottom } from "@/utils/ui";
import { useProtocolLogsSelector } from "@/redux/reducers/protocol-logs-slice";

export interface ProtocolLogsProps {}

export default function ProtocolLogs({}: ProtocolLogsProps) {
  const t = useTranslations("ai");
  const dispatch = useDispatch<AppDispatch>();
  const paymentsPaneRef = useRef<HTMLDivElement>(null);
  const protocolLogs = useSelector(useProtocolLogsSelector);
  const shouldScrollToBottom = useSelector(useShouldScrollToBottomSelector);

  useEffect(() => {
    scrollToBottom([paymentsPaneRef], () => {
      dispatch(setShouldScrollToBottom(false));
    });
  }, [shouldScrollToBottom]);

  // The URL for the ChatGPT logo
  const chatGptLogoUrl = "/images/aichat/logo-chatgpt.svg";

  return (
    <div
      className="mb-4 flex-grow items-start overflow-scroll rounded-md bg-gray-900"
      ref={paymentsPaneRef}
    >
      <div className="relative mx-auto max-w-2xl p-4">
        <div className="h-full text-gray-300" id="code">
          <ul>
            {protocolLogs.map((payment: PaymentType, index: number) => {
              if (!payment) return null;
              return (
                <li key={index} className="mb-2 flex last:font-semibold">
                  {/* Directly render the ChatGPT icon */}
                  <span className={`mr-2 size-4 shrink-0`}>
                    <img
                      src={chatGptLogoUrl}
                      alt="ChatGPT"
                      className={"inline-block size-4 rounded-sm"}
                    />
                  </span>
                  <div>
                    <span className="block">
                      {t("paymentLogs.textQuote", {
                        destination: `${payment.destinationName} 
                          ${
                            payment.destinationName === "KaggleAI"
                              ? "data"
                              : "service"
                          }`,
                        amount: Number(payment.amount) / 1000000,
                      })}
                    </span>
                    {payment.status === "SUCCESS" && (
                      <span className="block text-teal-500">
                        {t("paymentLogs.textQuotePaidTo", {
                          amount: Number(payment.amount) / 1000000,
                          currency: payment.currency,
                          destination: payment.destinationName,
                        })}
                      </span>
                    )}
                    {payment.status === "DENIED" && (
                      <span className="block text-rose-500">
                        {t("paymentLogs.textQuoteRejected", {
                          errorMessage: payment.message,
                        })}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
