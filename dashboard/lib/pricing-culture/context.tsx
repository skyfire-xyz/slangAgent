"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

import { useSkyfireAPIClient } from "../skyfire-sdk/context/context"
import exampleData from "./example.json"
import { MarketCompAttributes, MarketCompObject } from "./type"

interface PricingCultureContextType {
  marketComps: MarketCompObject[]
  loading: boolean
  error: string | null
  selectedComp: MarketCompAttributes[] | null
  fetchCompDetails: (id: string, from: string, to: string) => Promise<void>
  exampleData: MarketCompAttributes[] | null
}

const PricingCultureContext = createContext<
  PricingCultureContextType | undefined
>(undefined)

export const PricingCultureProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const client = useSkyfireAPIClient()
  const [marketComps, setMarketComps] = useState<MarketCompObject[]>([])
  const [loadingList, setLoadingList] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedComp, setSelectedComp] = useState<
    MarketCompAttributes[] | null
  >(null)

  useEffect(() => {
    const fetchMarketComps = async () => {
      if (!client) return
      setLoadingList(true)
      try {
        const response = await client.get(
          `/proxy/pricing-culture/api/data/dailycomps`,
          {
            metadataForAgent: {
              title: `Daily Comps`,
              useWithChat: true,
              correspondingPageURLs: ["/"],
              customPrompts: ["Can you give me the list of luxury goods?"],
            },
          }
        )
        setMarketComps(response.data.objects)
        setLoadingList(false)
      } catch (err) {
        setError("Failed to fetch market comps")
        setLoadingList(false)
      }
    }
    fetchMarketComps()
  }, [client])

  const fetchCompDetails = async (id: string, from: string, to: string) => {
    if (!client || loadingDetails) return
    setLoadingDetails(true)
    setError(null)
    try {
      const response = await client.get(
        `/proxy/pricing-culture/api/data/dailycomps/snapshot?id=${id}&start_time=${from}&end_time=${to}`,
        {
          metadataForAgent: {
            title: `Snapshots between ${from} to ${to}`,
            useWithChat: true,
            correspondingPageURLs: ["/detail/[id]"],
            customizeResponse: (response) => {
              const customizedObjects = response.data.objects.map(
                (arr: any) => {
                  return {
                    ...arr,
                    prices: [],
                  }
                }
              )
              return {
                ...response,
                data: {
                  ...response.data,
                  objects: customizedObjects,
                },
              }
            },
            customPrompts: [
              "Can you summarize the data?",
              "What's the average price of the day?",
              "What are the average prices for each day?",
              "Tell me more about the cheapest item?",
              "Tell me more about the most expensive item?",
            ],
          },
        }
      )
      setSelectedComp(response.data.objects)
      setLoadingDetails(false)
    } catch (err) {
      setError("Failed to fetch comp details")
      setLoadingDetails(false)
    }
  }

  return (
    <PricingCultureContext.Provider
      value={{
        marketComps,
        loading: loadingList || loadingDetails,
        error,
        selectedComp,
        fetchCompDetails,
        exampleData: exampleData || null,
      }}
    >
      {children}
    </PricingCultureContext.Provider>
  )
}

export const usePricingCulture = () => {
  const context = useContext(PricingCultureContext)
  if (context === undefined) {
    throw new Error(
      "usePricingCulture must be used within a PricingCultureProvider"
    )
  }
  return context
}

export const useSelectedComp = ({
  id,
  from,
  to,
}: {
  id: string
  from: string
  to: string
}): {
  meta: MarketCompObject | null
  data: MarketCompAttributes[] | null
} => {
  const init = useRef(false)
  const router = useRouter()
  const client = useSkyfireAPIClient()
  const { marketComps, selectedComp, fetchCompDetails } = usePricingCulture()

  useEffect(() => {
    if (id && client && !init.current) {
      const fromDate = new Date(from)
      const toDate = new Date(to)
      const diffTime = Math.abs(toDate.getTime() - fromDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays > 31) {
        router.push("/")
      } else {
        init.current = true
        fetchCompDetails(id, from, to)
      }
    }
  }, [id, client])

  const selectedCompDetail = id
    ? marketComps.find((comp) => comp.id == Number(id))
    : null

  return {
    meta: selectedCompDetail || null,
    data: selectedComp
      ? selectedComp.filter((comp) => comp.market_comp_id === Number(id))
      : null,
  }
}
