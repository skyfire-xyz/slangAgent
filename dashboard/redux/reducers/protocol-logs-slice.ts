import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { executeTask, postChat } from "../thunk-actions";
import { ProtocolLogsReduxState } from "../types";

const initialState: ProtocolLogsReduxState = {
  logs: [],
};

function updateProtocolLogsState(
  state: ProtocolLogsReduxState,
  action: PayloadAction<any>,
) {
  const logs = action.payload.quote || [action.payload.payment];
  if (logs) {
    state.logs = [...state.logs, ...logs];
  }
}

export const protocolLogsSlice = createSlice({
  name: "protocolLogs",
  initialState,
  reducers: {
    addProtocolLog: (state, { payload }) => {
      updateProtocolLogsState(state, payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // PostChat
      .addCase(postChat.fulfilled, (state, action) => {
        updateProtocolLogsState(state, action);
      })
      // Execute Tasks
      .addCase(executeTask.fulfilled, (state, action) => {
        updateProtocolLogsState(state, action);
      });
  },
});

export const useProtocolLogsSelector = (state: any) => {
  return state?.protocolLogs.logs;
};

export const { addProtocolLog } = protocolLogsSlice.actions;

export default protocolLogsSlice.reducer;
