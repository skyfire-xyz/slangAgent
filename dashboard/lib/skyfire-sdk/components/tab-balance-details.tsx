import React from "react"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useSkyfire } from "../context/context"
import { usdAmount } from "../util"
import LogoutButton from "./logout"

interface WalletDetailsPanelProps {
  wallet: {
    walletName: string
    walletAddress: string
    network: string
    walletType: string
  } | null
  balance: {
    escrow: {
      total: string
      available: string
      allowance: string
    }
    native: {
      balance: string
    }
  } | null
}

export function WalletDetailsPanel({
  wallet,
  balance,
}: WalletDetailsPanelProps) {
  const { dispatch, logout } = useSkyfire()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Wallet Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 w-full">
          <p>
            <strong className="font-medium">Name:</strong> {wallet?.walletName}
          </p>
          <p>
            <strong className="font-medium">Address:</strong>{" "}
            {wallet?.walletAddress}
          </p>
          <p>
            <strong className="font-medium">Network:</strong> {wallet?.network}
          </p>
          <p>
            <strong className="font-medium">Type:</strong> {wallet?.walletType}
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Balance Details</h3>
          <p>
            <strong className="font-medium">Total Escrow:</strong>{" "}
            {usdAmount(balance?.escrow.total || "0")}
          </p>
          <p>
            <strong className="font-medium">Available Escrow:</strong>{" "}
            {usdAmount(balance?.escrow.available || "0")}
          </p>
          <p>
            <strong className="font-medium">Allowance:</strong>{" "}
            {usdAmount(balance?.escrow.allowance || "0")}
          </p>
          <p>
            <strong className="font-medium">Native Balance:</strong>{" "}
            {usdAmount(balance?.native.balance || "0")}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <LogoutButton onLogout={logout} />
      </CardFooter>
    </Card>
  )
}
