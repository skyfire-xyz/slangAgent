export type ChatMessageType = {
  type:
    | "chat"
    | "error"
    | "dataset_search"
    | "tasklist"
    | "web_search"
    | "video_search"
    | "text_completion"
    | "image_generation"
    | "meme"
    | "random_joke"
    | "dataset_download";
  direction: "left" | "right";
  avatarUrl: string;
  textMessage: string;
  data?: any;
  contentImageUrl?: string;
};

export type PaymentType = {
  userUuid: string;
  status: "SUCCESS" | "DENIED";
  network: string;
  currency: string;
  destinationAddress: string;
  destinationName: string;
  generatedDate: string;
  sourceAddress: string;
  sourceName: string;
  amount: string;
  message: string;
};
