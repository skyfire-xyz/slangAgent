import * as React from "react";

const BouncingDotsLoader = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <span className="sr-only">Loading...</span>
      <div className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-white"></div>
    </div>
  );
};

export default BouncingDotsLoader;
