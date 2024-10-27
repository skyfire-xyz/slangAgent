"use client";

import Header from "../components/header";
import AiChat from "../components/ai-chat";

export default function Home() {
  return (
    <div
      className={`font-jones h-screen bg-gradient-to-br from-zinc-900 to-zinc-600`}
    >
      <div className="h-[calc(100%-220px)] md:h-[calc(100%-200px)]">
        <Header />
        <AiChat images={[]} />
      </div>
    </div>
  );
}
