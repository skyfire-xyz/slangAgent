import { createSlice } from "@reduxjs/toolkit";
import { fetchLogoAgent, postChat } from "../thunk-actions";

export interface UIEffectReduxState {
  shouldScrollToBottom: boolean;
}

const initialState: UIEffectReduxState = {
  shouldScrollToBottom: false,
};

export const uiEffectSlice = createSlice({
  name: "uiEffect",
  initialState,
  reducers: {
    setShouldScrollToBottom: (state, { payload }) => {
      state.shouldScrollToBottom = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postChat.pending, (state, action) => {
        state.shouldScrollToBottom = true;
      })
      .addCase(postChat.fulfilled, (state, action) => {
        state.shouldScrollToBottom = true;
      })
      .addCase(fetchLogoAgent.pending, (state, action) => {
        state.shouldScrollToBottom = true;
      })
      .addCase(fetchLogoAgent.fulfilled, (state, action) => {
        state.shouldScrollToBottom = true;
      })
      .addCase("chat/addMessage", (state, action) => {
        state.shouldScrollToBottom = true;
      });
  },
});

export const useShouldScrollToBottomSelector = (state: any) => {
  return state?.uiEffect.shouldScrollToBottom;
};

export const { setShouldScrollToBottom } = uiEffectSlice.actions;

export default uiEffectSlice.reducer;
