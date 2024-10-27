import { Message } from "ai"
import { AxiosResponse } from "axios"

export function formatReponseToChatSystemData(
  response: AxiosResponse,
  existingMessages: Message[]
): Message[] {
  const messageId = `claim-${response.config.url}`

  // Check if the message already exists
  const messageExists = existingMessages.some((msg) => msg.id === messageId)
  if (messageExists) {
    return [] // Return an empty array if the message already exists
  }

  const originalMessageObj: Message = {
    id: messageId,
    role: "system",
    content: `Response from ${response.config.url}`,
  }

  const chunkedMessages: Message[] = [
    {
      id: `${messageId}-chunk-0`,
      role: "system",
      content: `<Chunk>This is the JSON data from the API response ${
        response.config.url
      }. Please answer my questions based on this data. ${JSON.stringify(
        response.data
      )}`,
    } as Message,
  ]

  return [originalMessageObj, ...chunkedMessages]
}

export function concatenateMessages(
  newMessages: Message[],
  existingMessages: Message[]
): Message[] {
  return [...existingMessages, ...newMessages]
}
