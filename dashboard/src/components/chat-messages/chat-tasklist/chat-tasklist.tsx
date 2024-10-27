import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useTranslations } from "next-intl";
import { Badge, Button, Card } from "flowbite-react";
import {
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank,
} from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import { ImSpinner11 } from "react-icons/im";
import { FaPlay } from "react-icons/fa";
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";
import TaskSource from "./task-source";

import { useTasklistSelector } from "../../../redux/reducers/chat-slice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/src/redux/store";

import TaskContent from "./task-content";
import { executeTask } from "@/src/redux/thunk-actions";

export interface ChatTaskListProps {
  avatarUrl?: string;
  textMessage?: string;
  results?: string[];
}

function ChatTaskList({ textMessage, avatarUrl, results }: ChatTaskListProps) {
  const t = useTranslations("ai");
  const tasks = useSelector(useTasklistSelector);

  const [showTasks, setShowTasks] = useState<{ [key: number]: boolean }>({});
  const dispatch = useDispatch<AppDispatch>();
  const [executeAll, setExecuteAll] = useState(false);

  useEffect(() => {
    if (executeAll) {
      const isAllExecuted = results?.every((result) => {
        const task = tasks[result];
        return (
          task.status === "complete" ||
          task.status === "pending" ||
          task.status === "error"
        );
      });
      if (!isAllExecuted) {
        results?.forEach((result) => {
          const task = tasks[result];
          if (
            task.status === "complete" ||
            task.status === "pending" ||
            task.status === "error" ||
            !task.isDependentTasksComplete
          )
            return;
          dispatch(executeTask({ task }));
        });
      } else {
        setExecuteAll(false);
      }
    }
  }, [executeAll, tasks]);

  return (
    <div className={`mb-4 flex justify-start`}>
      <img
        src={avatarUrl}
        className="h-10 w-10 rounded-full object-cover"
        alt=""
      />
      <div className="ml-2 max-w-[calc(100%-80px)] rounded-br-3xl rounded-tl-xl rounded-tr-3xl bg-[#009182] px-4 py-3">
        <article className="prose text-white">
          <Markdown>{textMessage}</Markdown>
        </article>
        {results?.map((result, index) => {
          const task = tasks[result];
          let StatusIcon = MdOutlineCheckBoxOutlineBlank;
          if (task.status === "complete") {
            StatusIcon = MdOutlineCheckBox;
          } else if (task.status === "pending") {
            StatusIcon = ImSpinner11;
          } else if (task.status === "error") {
            StatusIcon = RxCrossCircled;
          }

          return (
            <Card
              key={index}
              className={`mb-4 ${
                task.status === "complete"
                  ? "cursor-pointer bg-green-100"
                  : "white"
              } `}
            >
              <div className="flex items-center">
                <Badge color="gray" className="mr-2">
                  {task.id}
                </Badge>
                <TaskSource skillName={task.skill} />
                <div>
                  <p
                    className={`flex-grow-1 font-normal text-gray-700 dark:text-gray-400 ${task.status === "error" ? "text-red-400" : ""}`}
                    onClick={() => {
                      if (task.status === "complete") {
                        setShowTasks({
                          ...showTasks,
                          [task.id]: !showTasks[task.id],
                        });
                      }
                    }}
                  >
                    {task.task}
                  </p>
                  {task.dependent_task_ids.length > 0 && (
                    <div className="mt-2">
                      <span className="mr-2 text-sm text-gray-400">
                        Dependent Tasks:
                      </span>
                      {task.dependent_task_ids.map(
                        (id: number, index: number) => (
                          <Badge
                            key={index}
                            color="gray"
                            className="mr-2 inline-block"
                          >
                            {id}
                          </Badge>
                        ),
                      )}
                    </div>
                  )}
                </div>
                <div className="ml-auto flex items-center">
                  {task.status === "incomplete" &&
                    task.isDependentTasksComplete && (
                      <Button
                        color="light"
                        className="ml-4"
                        onClick={() => dispatch(executeTask({ task }))}
                      >
                        <div className="flex items-center">
                          <FaPlay
                            color="#009182"
                            className="h-4 w-4 flex-shrink-0 cursor-pointer"
                          />
                        </div>
                      </Button>
                    )}
                  {task.status === "error" && (
                    <div className="ml-4 flex items-center">
                      <RxCrossCircled
                        color="red"
                        className="h-6 w-6 flex-shrink-0"
                      />
                    </div>
                  )}
                  {task.status === "pending" && (
                    <Button
                      color="light"
                      className="ml-4"
                      disabled
                      onClick={() => dispatch(executeTask({ task }))}
                    >
                      <div className="flex animate-spin items-center">
                        <ImSpinner11
                          color="#009182"
                          className="h-4 w-4 flex-shrink-0 cursor-pointer"
                        />
                      </div>
                    </Button>
                  )}
                  {task.status === "complete" &&
                    (showTasks[task.id] ? (
                      <MdOutlineArrowDropUp
                        className="h-8 w-8 flex-shrink-0 cursor-pointer"
                        onClick={() => {
                          setShowTasks({
                            ...showTasks,
                            [task.id]: !showTasks[task.id],
                          });
                        }}
                      />
                    ) : (
                      <MdOutlineArrowDropDown
                        className="h-8 w-8 flex-shrink-0 cursor-pointer"
                        onClick={() => {
                          setShowTasks({
                            ...showTasks,
                            [task.id]: !showTasks[task.id],
                          });
                        }}
                      />
                    ))}
                </div>
              </div>
              {showTasks[task.id] && <TaskContent task={task} />}
            </Card>
          );
        })}
        <div className="flex gap-4">
          <Button
            className="mt-2"
            onClick={() => {
              setExecuteAll(true);
            }}
          >
            Execute All Tasks
          </Button>
          <Button
            className="mt-2"
            onClick={() => {
              {
                results?.forEach((result, index) => {
                  const task = tasks[result];
                  setShowTasks({ ...showTasks, [task.id]: true });
                });
              }
            }}
          >
            Show All Results
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatTaskList;
