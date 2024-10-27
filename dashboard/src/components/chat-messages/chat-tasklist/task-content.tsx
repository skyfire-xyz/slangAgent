import { useMemo } from "react";
import BodyVideos from "../body-videos";
import BodySearch from "../body-search";
import BodyDataset from "../body-dataset";

export default function TaskContent({ task }: { task: any }) {
  return (
    <div>
      {task.skill === "video_search" && (
        <BodyVideos results={task.result.results} />
      )}
      {task.skill === "web_search" && (
        <BodySearch results={task.result.results} />
      )}
      {task.skill === "image_generation" && <img src={task.result.imageUrl} />}
      {task.skill === "text_completion" && task?.result?.body}
      {task.skill === "random_joke" && task?.result?.joke}
      {task.skill === "dataset_search" && <BodyDataset {...task.result} />}
    </div>
  );
}
