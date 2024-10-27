import { Card } from "flowbite-react";
import { ChatWebSearchProps } from "./chat-web-search";

export default function BodySearch({
  results,
}: {
  results: ChatWebSearchProps["results"];
}) {
  return results?.map((result, index) => (
    <Card
      key={index}
      className="mb-2 max-w-lg cursor-pointer"
      onClick={() => window.open(result.link, "_blank", "noopener,noreferrer")}
      horizontal
    >
      <h5 className="font-bold tracking-tight text-gray-900 dark:text-white">
        {result.title}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {result.snippet}
      </p>
    </Card>
  ));
}
