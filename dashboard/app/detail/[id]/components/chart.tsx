"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, YAxis } from "recharts"

import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "An interactive bar chart"

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

interface ChartProps {
  prices: string[]
  max: string
  min: string
  numItems: number
}

const formatYAxisTick = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export default function Chart({ prices, max, min, numItems }: ChartProps) {
  const [showChart, setShowChart] = React.useState(false)
  const [chartData, setChartData] = React.useState<{ price: number }[]>([])

  const loadChartData = () => {
    setShowChart(true)
    setChartData(prices.map((price) => ({ price: Number(price) })))
  }

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Available Prices</CardTitle>
          <CardDescription></CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row">
          <div className="flex-1 border-b sm:border-b-0 sm:border-r p-4 sm:p-6">
            <span className="block text-xs text-muted-foreground mb-1">
              Number of Items
            </span>
            <span className="text-xl font-bold leading-none sm:text-2xl lg:text-3xl">
              {numItems}
            </span>
          </div>
          <div className="flex-1 border-b sm:border-b-0 sm:border-r p-4 sm:p-6">
            <span className="block text-xs text-muted-foreground mb-1">
              Min Price
            </span>
            <span className="text-xl font-bold leading-none sm:text-2xl lg:text-3xl">
              {formatPrice(min)}
            </span>
          </div>
          <div className="flex-1 p-4 sm:p-6">
            <span className="block text-xs text-muted-foreground mb-1">
              Max Price
            </span>
            <span className="text-xl font-bold leading-none sm:text-2xl lg:text-3xl">
              {formatPrice(max)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6 relative">
        {!showChart && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 h-full">
            <div className="h-full flex items-center">
              <Button onClick={loadChartData} disabled={showChart}>
                Show Chart
              </Button>
            </div>
          </div>
        )}
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <Bar dataKey="price" type="natural" fill="var(--color-price)" />
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <YAxis
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={formatYAxisTick}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
