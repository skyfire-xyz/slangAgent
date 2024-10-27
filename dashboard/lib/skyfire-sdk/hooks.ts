"use client"

import { useEffect } from "react"
import { Message } from "ai"
import { AxiosResponse } from "axios"

export function addDatasets(
  responses: AxiosResponse[],
  messages: Message[],
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[])
  ) => void
) {
  const systemMessages = responses.flatMap((res) => {
    return formatReponseToChatSystemData(res, messages)
  })
  if (systemMessages.length > 0) {
    setMessages((prevMessages) => {
      const messages = prevMessages.filter((msg) => msg.role !== "system")
      return concatenateMessages([systemMessages, messages])
    })
  }
}

export function formatReponseToChatSystemData(
  response: AxiosResponse,
  existingMessages: Message[]
): Message[] {
  const messageId = `claim-${response.config.url}`

  const originalMessageObj: Message = {
    id: messageId,
    role: "system",
    content: `${
      response.config.metadataForAgent?.title ||
      `Response from ${response.config.url}`
    } attached.`,
  }

  const chunkedMessages: Message[] = [
    {
      id: `${messageId}-chunk-0`,
      role: "system",
      content: `<Chunk>This is the JSON data from the API "${
        response.config.metadataForAgent?.title || ""
      }" response ${
        response.config.url
      }. Please answer my questions based on this data [Data]"${JSON.stringify(
        response.data
      )}[/Data]. When you answer the questions, don't use JSON format directly`,
    } as Message,
  ]

  return [originalMessageObj, ...chunkedMessages]
}

export function concatenateMessages(messageGroups: Message[][]): Message[] {
  return messageGroups.reduce((acc, group) => acc.concat(group), [])
}
