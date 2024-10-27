type ProxyName =
  | "chatGpt"
  | "chatSlangOpenRouter"
  | "chatTranslateOpenRouter"
  | "chatSlangAgent"
  | "video"
  | "websearch"
  | "tasklist"
  | "joke"
  | "image"
  | "searchDataset"; // TODO: Ideally FE should get this type from SDK

type ReceiverConfig = {
  typeName: string; // type name used in FE to identify the receiver ( parameter received from BE for dependant call )
  proxyName: ProxyName; // Fundtion name in client.proxies
  sourceName: string; // source name received in BE payment
  logoImageURL: string; // logo image url
  examplePrompt: JSX.Element | null; // Example Prompt HTML
  promptHandler: (inputText: string, context: any) => Promise<boolean>; // Right a logic to handle the prompt for this receiver
};

export class Receiver {
  typeName: string;
  proxyName: ProxyName;
  sourceName: string;
  logoImageURL: string;
  examplePrompt: JSX.Element | null;
  promptHandler: (inputText: string, context: any) => Promise<boolean>;

  constructor(config: ReceiverConfig) {
    this.typeName = config.typeName;
    this.proxyName = config.proxyName;
    this.sourceName = config.sourceName;
    this.logoImageURL = config.logoImageURL;
    this.examplePrompt = config.examplePrompt;
    this.promptHandler = config.promptHandler;
  }

  async handlePrompt(inputText: string, context: any): Promise<boolean> {
    return this.promptHandler(inputText, context);
  }
}
