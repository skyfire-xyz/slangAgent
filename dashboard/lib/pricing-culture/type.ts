// Response type for /api/data/dailycomps

export interface MarketCompParams {
  pc_tag: string
  min_price: number | null
  max_price: number | null
  platform_ids: number[]
  trim_percent: number
  img_url?: string
  image_url?: string | null
}

export interface MarketCompAttributes {
  id: number
  market_comp_id: number
  event_time: string
  value_min: string
  value_max: string
  value_average: string
  number_of_constituents: number
  value_min_asset: AssetInfo
  value_max_asset: AssetInfo
  prices: string[]
}

export interface MarketCompObject {
  id: number
  comp_type: string
  name: string
  description: string
  params: MarketCompParams
  attributes: MarketCompAttributes
  frequency_in_days: number
  func: null
  is_template: boolean
  available_for_buyer: boolean
  last_run_on: string
  publish: boolean
  comparable_idx: string | null
  tags: null
  alias_id: null
}

interface MarketCompResponse {
  status: string
  objects: MarketCompObject[]
}

// Response type for /api/data/dailycomps

export interface AssetInfo {
  id: number
  media: string[]
  name: string
  url: string
  description: string
  platform: string
}

export interface DailyCompObject {
  id: number
  market_comp_id: number
  event_time: string
  value_min: string
  value_max: string
  value_average: string
  number_of_constituents: number
  value_min_asset: AssetInfo
  value_max_asset: AssetInfo
  prices: string[]
  comparable_idx: string | null
  recent_avg: string | null
}

export interface DailyCompResponse {
  status: string
  objects: DailyCompObject[]
  subscriber: boolean
}

export interface PricingCultureState {
  marketComps: MarketCompObject[]
  loading: boolean
  error: string | null
}
