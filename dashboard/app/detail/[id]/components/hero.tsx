"use client";
import AiChat from "@/components/ai-chat";

export default function Hero() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#1A1C26] via-black to-[#ffd941] text-white">
      <div className="w-full h-[500px] flex items-center justify-center">
        <AiChat images={[]} />
      </div>
    </div>
  );
}
