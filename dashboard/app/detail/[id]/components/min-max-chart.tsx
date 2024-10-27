"use client"

import * as React from "react"
import { max, min } from "lodash"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  DailyCompObject,
  MarketCompAttributes,
} from "@/lib/pricing-culture/type"
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
  average: {
    label: "Average",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

interface ChartProps {
  title?: string
  data: MarketCompAttributes[] | null
  from: string
  to: string
}

const formatYAxisTick = (value: number) => {
  // Format the number with 2 decimal places and add commas for thousands
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export default function MinMaxChart({ title, data, from, to }: ChartProps) {
  const chartData = data
    ? data.map((event: MarketCompAttributes) => ({
        date: event.event_time,
        average: Number(event.value_average),
      }))
    : []

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>
            {title || "Average Price"} ( {from} - {to} )
          </CardTitle>
          <CardDescription></CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <Line
              dataKey="average"
              type="natural"
              stroke="var(--color-average)"
              strokeWidth={4}
              dot={{ stroke: "", strokeWidth: 1, r: 4, strokeDasharray: "" }}
            />
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <YAxis
              domain={[
                (dataMin: number) => dataMin - dataMin * 0.05,
                (dataMax: number) => dataMax + dataMax * 0.05,
              ]}
              tickFormatter={formatYAxisTick}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
