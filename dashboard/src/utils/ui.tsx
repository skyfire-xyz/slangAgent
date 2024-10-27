export function scrollToBottom(refs: any, stopScroll: () => void) {
  refs.forEach((ref: { current: HTMLDivElement }) => {
    ref.current?.scrollTo({ top: 99999, behavior: "smooth" });
  });

  // Account for image load
  const timer = setInterval(() => {
    refs.forEach((ref: { current: HTMLDivElement }) => {
      ref.current?.scrollTo({ top: 99999, behavior: "smooth" });
    });
  }, 300);
  setTimeout(() => {
    clearInterval(timer);
    stopScroll();
  }, 900);
}

export function getLogoAIData() {
  const defailtLogoAI = {
    service: "LogoAI",
    price: 100000,
  };
  try {
    const key = "__storage__ai-demo";
    if (typeof window !== "undefined") {
      const data = window["localStorage"].getItem(key);
      if (data) {
        return JSON.parse(data);
      }
      return defailtLogoAI;
    } else {
      return defailtLogoAI;
    }
  } catch {
    return defailtLogoAI;
  }
}
