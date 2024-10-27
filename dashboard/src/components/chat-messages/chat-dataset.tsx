import BodyDataset from "./body-dataset";

export interface ChatDatasetProps {
  textMessage: string;
  avatarUrl?: string;
  datasets: any;
}

function ChatDataset(props: ChatDatasetProps) {
  return (
    <div className={`mb-4 flex justify-start`}>
      <img
        src={props.avatarUrl}
        className="h-10 w-10 rounded-full object-cover"
        alt=""
      />
      <div className="ml-2 rounded-br-3xl rounded-tl-xl rounded-tr-3xl bg-[#009182] px-4 py-3 text-white">
        <span>{props.textMessage}</span>
        <BodyDataset {...props} />
      </div>
    </div>
  );
}

export default ChatDataset;
