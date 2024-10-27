import { NextResponse } from "next/server"
import { OpenAIStream, StreamingTextResponse, convertToCoreMessages } from "ai"

import { SKYFIRE_ENDPOINT_URL } from "@/lib/skyfire-sdk/env"

export async function POST(request: Request) {
  const req = await request.json()
  const apiKey = request.headers.get("skyfire-api-key")
  const { messages } = req

  if (!apiKey) {
    return NextResponse.json({ message: "Missing API Key" }, { status: 401 })
  }

  const streamResponse = await fetch(
    `${SKYFIRE_ENDPOINT_URL}/proxy/openrouter/v1/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "skyfire-api-key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-flash-1.5-8b",
        messages: convertToCoreMessages(messages),
        stream: true,
      }),
    }
  )

  if (!streamResponse.ok) {
    if (streamResponse.status === 402) {
      return NextResponse.json(
        "Your account balance is too low for this transaction. Please top-up your account to proceed.",
        { status: streamResponse.status }
      )
    }
    return NextResponse.json(
      { message: "API request failed" },
      { status: streamResponse.status }
    )
  }

  if (streamResponse.body) {
    const stream = OpenAIStream(streamResponse)
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        // Pass through the original chunk
        controller.enqueue(chunk)
      },
    })
    const modifiedStream = stream.pipeThrough(transformStream)
    const response = new StreamingTextResponse(modifiedStream)

    // Add any headers from the original streamResponse
    const headerEntries = Array.from(streamResponse.headers.entries())
    for (const [key, value] of headerEntries) {
      if (key.toLowerCase().startsWith("skyfire-")) {
        response.headers.set(key, value)
      }
    }

    return response
  }
}
