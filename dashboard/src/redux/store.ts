"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import chatSlice from "./reducers/chat-slice";
import protocolLogsSlice from "./reducers/protocol-logs-slice";
import uiEffectSlice from "./reducers/ui-effect-slice";

export const store = configureStore({
  reducer: combineReducers({
    chat: chatSlice,
    protocolLogs: protocolLogsSlice,
    uiEffect: uiEffectSlice,
  }),
});

export type AppDispatch = typeof store.dispatch;
