import { AxiosError, AxiosResponse } from "axios"

type NetworkType =
  | "polygon_testnet"
  | "polygon_mainnet"
  | "coinbase_mainnet"
  | "coinbase_testnet"

// Wallet Data Response
interface Wallet {
  id: string
  userId: string
  walletName: string
  isDefault: boolean
  walletType: string
  network: NetworkType
  walletAddress: string
  createdDate: string
  updatedDate: string
}

interface OnchainBalance {
  total: string
}

interface EscrowBalance {
  total: string
  available: string
  allowance: string
}

interface Claims {
  sent: string
  received: string
}

interface NativeBalance {
  balance: string
}

interface Balance {
  address: string
  network: string
  isSmartAccount: boolean
  onchain: OnchainBalance
  escrow: EscrowBalance
  claims: Claims
  native: NativeBalance
}

export interface WalletDataResponse {
  wallet: Wallet
  balance: Balance
}

// PaymentClaim
type ClaimStatus = "SUCCESS" | "PENDING" | "FAILED"

export type PaymentClaim = {
  createdAt: string
  currency: string
  destinationAddress: string
  destinationName: string
  id: string
  network: NetworkType
  nonce: string
  referenceId: string
  signature: string
  sourceAddress: string
  sourceName: string
  status: ClaimStatus
  type: string
  updatedAt: string
  value: string
}

export type PaymentClaimResponse = {
  claims: PaymentClaim[]
}

// Skyfire State
export interface SkyfireState {
  localAPIKey: string | null
  isAPIKeyInitialized: boolean
  balance: Balance | null
  wallet: Wallet | null
  claims: PaymentClaim[] | null
  loading?: boolean
  error: AxiosError | null
  responses: AxiosResponse[]
}
