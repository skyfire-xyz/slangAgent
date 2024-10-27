import { AxiosError, AxiosResponse } from "axios"

import { PaymentClaimResponse, SkyfireState, WalletDataResponse } from "./type"

export enum ActionType {
  UPDATE_SKYFIRE_INFO = "UPDATE_SKYFIRE_INFO",
  SAVE_LOCAL_API_KEY = "SAVE_LOCAL_API_KEY",
  UPDATE_WALLET_INFO = "UPDATE_WALLET_INFO",
  UPDATE_CLAIMS_INFO = "UPDATE_CLAIMS_INFO",
  LOADING = "LOADING",
  UPDATE_ERROR = "UPDATE_ERROR",
  ADD_RESPONSE = "ADD_RESPONSE",
  CLEAR_RESPONSES = "CLEAR_RESPONSES", // New action type
}

interface UpdateSkyfireInfoAction {
  type: ActionType.UPDATE_SKYFIRE_INFO
  payload: Partial<SkyfireState>
}

interface SaveLocalAPIKeyAction {
  type: ActionType.SAVE_LOCAL_API_KEY
  payload: SkyfireState["localAPIKey"]
}

interface UpdateWalletInfoAction {
  type: ActionType.UPDATE_WALLET_INFO
  payload: WalletDataResponse
}

interface UpdateClaimsInfoAction {
  type: ActionType.UPDATE_CLAIMS_INFO
  payload: PaymentClaimResponse
}

interface UpdateErrorAction {
  type: ActionType.UPDATE_ERROR
  payload: AxiosError | null
}

interface LoadingAction {
  type: ActionType.LOADING
  payload: boolean
}

interface AddResponseAction {
  type: "ADD_RESPONSE"
  payload: AxiosResponse
}

interface ClearResponsesAction {
  type: ActionType.CLEAR_RESPONSES
}

// Actions Types
export type SkyfireAction =
  | UpdateSkyfireInfoAction
  | SaveLocalAPIKeyAction
  | UpdateWalletInfoAction
  | UpdateClaimsInfoAction
  | LoadingAction
  | UpdateErrorAction
  | AddResponseAction
  | ClearResponsesAction

// Actions
export const updateSkyfireInfo = (data: SkyfireState): SkyfireAction => ({
  type: ActionType.UPDATE_SKYFIRE_INFO,
  payload: data,
})

export const updateSkyfireAPIKey = (
  data: SkyfireState["localAPIKey"]
): SkyfireAction => ({
  type: ActionType.SAVE_LOCAL_API_KEY,
  payload: data,
})

export const updateSkyfireWallet = (
  data: WalletDataResponse
): SkyfireAction => ({
  type: ActionType.UPDATE_WALLET_INFO,
  payload: data,
})

export const updateSkyfireClaims = (
  data: PaymentClaimResponse
): SkyfireAction => ({
  type: ActionType.UPDATE_CLAIMS_INFO,
  payload: data,
})

export const loading = (data: boolean): SkyfireAction => ({
  type: ActionType.LOADING,
  payload: data,
})

export const updateError = (error: AxiosError | null): SkyfireAction => ({
  type: ActionType.UPDATE_ERROR,
  payload: error,
})

export const addResponse = (response: AxiosResponse): SkyfireAction => ({
  type: ActionType.ADD_RESPONSE,
  payload: response,
})

export const clearResponses = (): SkyfireAction => ({
  type: ActionType.CLEAR_RESPONSES,
})
