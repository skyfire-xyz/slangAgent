import React from "react"
import { UseChatHelpers } from "ai/react/dist"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { updateSkyfireAPIKey } from "../context/action"
import { useSkyfire, useSkyfireState } from "../context/context"
import { usdAmount } from "../util"
import AIChatPanel from "./ai-chat-ui"
import { ClaimsWidget } from "./claims"
import LogoutButton from "./logout"
import { WalletDetailsPanel } from "./tab-balance-details"

interface WalletInterfaceProps {
  aiChatProps: UseChatHelpers
  errorMessage?: string | null
}
export function WalletInterface({
  aiChatProps,
  errorMessage,
}: WalletInterfaceProps) {
  const { wallet, balance, claims } = useSkyfireState()

  return (
    <Card className="skyfire-theme max-w-full h-[calc(100vh-200px)] flex flex-col">
      <CardHeader>
        <CardTitle>{usdAmount(balance?.escrow.available || "0")}</CardTitle>
        <CardDescription>{wallet?.walletAddress}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <Tabs defaultValue="wallet-info" className="h-full">
          <TabsList className="">
            <TabsTrigger value="wallet-info">Wallet Details</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>
          <TabsContent
            value="wallet-info"
            className="h-[calc(100%-50px)] flex flex-col gap-6 data-[state=inactive]:hidden"
          >
            <WalletDetailsPanel wallet={wallet} balance={balance} />
            <ClaimsWidget claims={claims || []} />
          </TabsContent>
          <TabsContent
            value="chat"
            className="h-full data-[state=inactive]:hidden"
          >
            <div className="h-full overflow-y-auto">
              <AIChatPanel
                aiChatProps={aiChatProps}
                errorMessage={errorMessage}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
