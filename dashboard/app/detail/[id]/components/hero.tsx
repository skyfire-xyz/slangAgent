"use client";
import AiChat from "@/components/ai-chat";

export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-[#1A1C26] via-black to-[#dbba37] text-white">
      <h1 className="text-5xl font-extrabold mb-2 mt-4 text-center">SlangAgent: Profittable AI Chatbot</h1>
      <p className="mt-0 mb-10 text-xl text-indigo-100 sm:text-2xl">
        Uses multiple LLMs and an accuracy algorithm to find the best response to conversational slang
      </p>
      <div className="w-full h-[500px] flex items-center justify-center">
        <AiChat images={[]} />
      </div>
    </div>
  );
}
