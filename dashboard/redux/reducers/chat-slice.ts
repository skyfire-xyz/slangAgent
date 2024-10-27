import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/api"
import { executeTask, fetchLogoAgent, postChat } from "../thunk-actions";
import { ChatMessageType, ChatSliceReduxState, Task } from "../types";

const robotImageUrl = "/images/aichat/ai-robot.png";

const initialState: ChatSliceReduxState = {
  messages: [],
  tasks: {},
  taskGroupIndex: 1,
  status: {
    botThinking: false,
  },
  error: {
    fetchAll: null,
  },
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addInitialMessage: (state, { payload }) => {
      if (state.messages.length === 0) {
        state.messages.push({
          type: "chat",
          direction: payload.direction,
          avatarUrl: payload.avatarUrl || robotImageUrl,
          textMessage: payload.textMessage,
        });
      }
    },
    addMessage: (state, { payload }) => {
      state.messages.push({
        type: payload.type || "chat",
        direction: payload.direction,
        avatarUrl: payload.avatarUrl || robotImageUrl,
        textMessage: payload.textMessage,
        data: payload.data,
      });
    },
    setBotStatus: (state, { payload }) => {
      state.status.botThinking = payload;
    },
  },
  extraReducers: (builder) => {
    builder

      /**
       * PostChat
       */
      // rebase test
      .addCase(postChat.pending, processPending)
      .addCase(postChat.fulfilled, (state, action) => {
        let data;
        let textMessage = action.payload.body;
        switch (action.payload.type) {
          case "dataset_search":
            data = action.payload.datasets || [];
            break;
          case "tasklist":
            data =
              action.payload.tasks.map(
                (task: { id: number }) => `${state.taskGroupIndex}-${task.id}`,
              ) || [];

            state.tasks = {
              ...state.tasks,
              ...action.payload.tasks.reduce(
                (obj: object, task: { id: number }) => {
                  const parentId = state.taskGroupIndex;
                  const referenceId = `${parentId}-${task.id}`;
                  return {
                    ...obj,
                    [referenceId]: {
                      ...task,
                      referenceId,
                      parentId,
                      objective: action.payload.prompt,
                    },
                  };
                },
                {},
              ),
            };
            state.taskGroupIndex++;
            break;
          case "web_search":
            data = action.payload.results || [];
            break;
          case "video_search":
            data = action.payload.results || [];
            break;
          case "meme":
            data = action.payload.imageUrl;
            break;
          case "image_generation":
            data = action.payload.imageUrl;
            break;
        }
        state.messages.push({
          uuid: action.payload.uuid,
          type: action.payload.type as ChatMessageType["type"],
          avatarUrl: robotImageUrl,
          data: data,
          textMessage: textMessage,
        });
        processFulfilled(state, action);
      })
      .addCase(postChat.rejected, processError)

      /**
       * Execute Tasks
       */
      .addCase(executeTask.pending, (state, action) => {
        state.tasks[action.meta.arg.task.referenceId].status = "pending";
      })
      .addCase(executeTask.fulfilled, (state, action) => {
        state.tasks[action.payload.task.referenceId].status = "complete";
        state.tasks[action.payload.task.referenceId].result = action.payload;
      })
      .addCase(executeTask.rejected, (state, action) => {
        state.tasks[action.meta.arg.task.referenceId].status = "error";
        state.error.fetchAll = "Something went wrong";
      })

      /**
       * Logo
       */
      .addCase(fetchLogoAgent.pending, processPending)
      .addCase(fetchLogoAgent.fulfilled, (state, action) => {
        state.messages.push({
          uuid: action.payload.uuid,
          type: "chat",
          avatarUrl: robotImageUrl,
          textMessage: action.payload.prompt,
          data: action.payload.imageUrl || [],
        });
        processFulfilled(state, action);
      })
      .addCase(fetchLogoAgent.rejected, processError);
  },
});

export const chatSelector = (state: any) => {
  return state?.chat;
};

export const useTasklistSelector = (state: any) => {
  // preprocess tasks
  const tasks = Object.assign({ ...state?.chat?.tasks });
  if (tasks && Object.keys(tasks).length > 0) {
    Object.values(state?.chat?.tasks).map((value) => {
      const task = value as Task;
      const dependentTasks = task.dependent_task_ids.map((id: number) => {
        const referenceId = `${task.parentId}-${id}`;
        return tasks[referenceId];
      });
      const isDependentTasksComplete = dependentTasks.every((task: any) => {
        return task.status === "complete";
      });

      tasks[task.referenceId] = {
        ...tasks[task.referenceId],
        isDependentTasksComplete,
      };
    });
  }

  return tasks;
};

function processPending(state: ChatSliceReduxState) {
  state.status.botThinking = true;
}
function processError(state: ChatSliceReduxState, action: PayloadAction<any>) {
  state.status.botThinking = false;
  state.messages.push({
    uuid: `${new Date().getTime()}`,
    type: "error",
    avatarUrl: robotImageUrl,
    textMessage:
      "Sorry, something went wrong when interacting with the AI. Please try again.",
  });
  state.error.fetchAll = "Something went wrong";
}
function processFulfilled(state: ChatSliceReduxState, action: PayloadAction) {
  state.status.botThinking = false;
}

export const { addInitialMessage, addMessage, setBotStatus } =
  chatSlice.actions;

export default chatSlice.reducer;
