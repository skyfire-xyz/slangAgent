"use client"

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react"
import axios, { AxiosInstance, AxiosResponse, isAxiosError } from "axios"

import {
  SkyfireAction,
  addResponse,
  clearResponses,
  loading,
  updateError,
  updateSkyfireAPIKey,
  updateSkyfireClaims,
  updateSkyfireWallet,
} from "@/lib/skyfire-sdk/context/action"

import { toast } from "../shadcn/hooks/use-toast"
import {
  getApiKeyFromLocalStorage,
  removeApiKeyFromLocalStorage,
  usdAmount,
} from "../util"
import { initialState, skyfireReducer } from "./reducer"
import { SkyfireState } from "./type"

declare module "axios" {
  export interface AxiosRequestConfig {
    metadataForAgent?: {
      title?: string
      useWithChat?: boolean
      correspondingPageURLs: string[]
      customizeResponse?: (response: AxiosResponse) => AxiosResponse
      customPrompts: string[]
    }
  }
}
interface SkyfireContextType {
  state: SkyfireState
  dispatch: React.Dispatch<SkyfireAction>
  apiClient: AxiosInstance | null
  logout: () => void
  pushResponse: (response: AxiosResponse) => void
  resetResponses: () => void
  getClaimByReferenceID: (referenceId: string | null) => Promise<boolean>
}

export const getItemNamesFromResponse = (response: AxiosResponse): string => {
  const config = response.config
  const title = config.metadataForAgent?.title || config.url || "Unknown"
  return title
}

const SkyfireContext = createContext<SkyfireContextType | undefined>(undefined)

export const SkyfireProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(skyfireReducer, initialState)

  // Create a memoized Axios instance
  const apiClient = useMemo(() => {
    if (!state.localAPIKey) return null
    const instance = axios.create({
      baseURL:
        process.env.NEXT_PUBLIC_SKYFIRE_API_URL || "https://api.skyfire.xyz",
    })

    // Request interceptor
    instance.interceptors.request.use(
      (config) => {
        config.headers["skyfire-api-key"] = state.localAPIKey
        if (config.url?.includes("proxy")) {
          dispatch(loading(true))
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    instance.interceptors.response.use(
      async (response) => {
        if (
          response.config.url?.includes("proxy") &&
          response.config.metadataForAgent?.useWithChat
        ) {
          if (response.config.metadataForAgent?.customizeResponse) {
            pushResponse(
              response.config.metadataForAgent?.customizeResponse(response)
            )
          } else {
            pushResponse(response)
          }
        }

        // Can Process Payment Here
        setTimeout(() => {
          dispatch(loading(false))
          if (response.headers["skyfire-payment-reference-id"]) {
            fetchUserBalance()
            fetchUserClaims()
            if (response.headers["skyfire-payment-amount"]) {
              toast({
                title: `Spent ${usdAmount(
                  response.headers["skyfire-payment-amount"]
                )}`,
                duration: 3000,
              })
            }
          }
        }, 500)
        return response
      },
      (error) => {
        dispatch(loading(false))
        if (error.response && error.response.status === 401) {
          // Handle unauthorized access
        }
        return Promise.reject(error)
      }
    )

    return instance
  }, [state.localAPIKey])

  useEffect(() => {
    const apiKey = getApiKeyFromLocalStorage()
    dispatch(updateSkyfireAPIKey(apiKey))
  }, [])

  async function fetchUserBalance() {
    if (apiClient) {
      try {
        const res = await apiClient.get("/v1/wallet/balance")
        dispatch(updateSkyfireWallet(res.data))
      } catch (e) {
        if (isAxiosError(e)) {
          dispatch(updateError(e))
        }
      }
    }
  }

  async function fetchUserClaims() {
    if (apiClient) {
      try {
        const res = await apiClient.get("/v1/wallet/claims")
        dispatch(updateSkyfireClaims(res.data))
      } catch (e: unknown) {
        if (isAxiosError(e)) {
          dispatch(updateError(e))
        }
      }
    }
  }

  async function getClaimByReferenceID(referenceId: string | null) {
    if (!referenceId || !apiClient) {
      return false
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
    try {
      const res = await apiClient.get(
        `v1/wallet/claimByReferenceId/${referenceId}`
      )
    } catch (error) {
      console.error("Error fetching claim:", error)
    }

    return false
  }

  function logout() {
    removeApiKeyFromLocalStorage()
    dispatch(updateSkyfireAPIKey(null))
  }

  function pushResponse(response: AxiosResponse) {
    dispatch(addResponse(response))
  }

  function resetResponses() {
    dispatch(clearResponses())
  }

  useEffect(() => {
    if (apiClient) {
      fetchUserBalance()
      fetchUserClaims()
    }
  }, [apiClient])

  return (
    <SkyfireContext.Provider
      value={{
        state,
        dispatch,
        apiClient,
        logout,
        pushResponse,
        resetResponses,
        getClaimByReferenceID,
      }}
    >
      {children}
    </SkyfireContext.Provider>
  )
}

export const useSkyfire = () => {
  const context = useContext(SkyfireContext)
  if (!context) {
    throw new Error("useSkyfire must be used within a SkyfireProvider")
  }
  return context
}

export const useSkyfireState = () => {
  const context = useContext(SkyfireContext)
  if (!context) {
    throw new Error("useSkyfire must be used within a SkyfireProvider")
  }
  return context.state
}

export const useSkyfireAPIKey = () => {
  const { state } = useSkyfire()

  return {
    localAPIKey: state?.localAPIKey,
    isReady: state?.isAPIKeyInitialized,
  }
}

export const useSkyfireAPIClient = () => {
  const { state, apiClient } = useSkyfire()
  if (!state.localAPIKey) return null
  return apiClient
}

export const useLoadingState = () => {
  const { state } = useSkyfire()
  return state?.loading
}

export const useSkyfireResponses = (pathname: string) => {
  const { state } = useSkyfire()
  if (state?.responses.length > 0) {
    return filterResponsesByUrl(state?.responses, pathname)
  }
  return state?.responses
}

function isUrlMatch(pathname: string, urlPatterns: string[]): boolean {
  return urlPatterns.some((pattern) => {
    // Convert the URL pattern to a regex
    const regexPattern = pattern.replace(/\[.*?\]/g, "[^/]+")
    const regex = new RegExp(`^${regexPattern}$`)
    return regex.test(pathname)
  })
}

function filterResponsesByUrl(
  responses: AxiosResponse[],
  pathname: string
): AxiosResponse[] {
  return responses.filter((response) => {
    const urls = response.config.metadataForAgent?.correspondingPageURLs || []
    return isUrlMatch(pathname, urls)
  })
}
