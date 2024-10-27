import api from "@/src/lib/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const postChat = createAsyncThunk<any, { chatType: string; data: any }>(
  "chat/postChat",
  async ({ chatType, data }) => {
    const res = await api.post(`/api/chat`, {
      chatType,
      data,
    });
    return { ...res.data, prompt, type: chatType, uuid: new Date().getTime() };
  },
);

export const executeTask = createAsyncThunk<any, { task: any }>(
  "chat/executeTask",
  async ({ task }, thunkAPI) => {
    const state: any = thunkAPI.getState();
    const { tasks } = state.chat;

    const dependentTasksResults = task.dependent_task_ids.reduce(
      (allResults: [], id: number) => {
        const dependentTask = tasks[`${task.parentId}-${id}`];
        if (dependentTask.status === "complete") {
          // TODO: This is only supporting websearch results for now.

          let results = dependentTask.result?.results; // Search
          if (dependentTask.skill === "text_completion") {
            // Perplexity
            results = [
              {
                title: dependentTask.result?.prompt,
                description: dependentTask.result?.body,
              },
            ];
          }
          if (!results) return allResults;

          return [
            ...allResults,
            ...results.map((result: any) => {
              const { title, description, snippet } = result;
              return { title, description: description || snippet }; // Result doesn't have "description", so use snippet for now
            }),
          ];
        }
      },
      [],
    );

    const res = await api.post(`/api/chat`, {
      chatType: task.skill,
      data: {
        prompt: task.task,
        objective: task.objective,
        dependentTasks: dependentTasksResults,
      },
    });
    return { ...res.data, task };
  },
);

export const fetchLogoAgent = createAsyncThunk<
  any,
  { logoAIAgent: { service: string; price: number } }
>("chat/fetchLogoAgent", async ({ logoAIAgent }) => {
  const res = await api.post(`v1/receivers/logo`, {
    agent: logoAIAgent.service,
    cost: logoAIAgent.price,
  });
  return { ...res.data, type: "logo", uuid: new Date().getTime() };
});
