"use client"

import Link from "next/link"

import { usePricingCulture } from "@/lib/pricing-culture/context"
import { Button } from "@/components/ui/button"

import MinMaxChart from "./min-max-chart"

export default function Hero() {
  const { exampleData } = usePricingCulture()
  const getLastWeekRange = () => {
    const today = new Date()
    const lastWeekEnd = new Date(
      today.setDate(today.getDate() - today.getDay() - 1)
    )
    const lastWeekStart = new Date(lastWeekEnd)
    lastWeekStart.setDate(lastWeekStart.getDate() - 6)

    const formatDate = (date: Date) => date.toISOString().split("T")[0]

    return {
      from: formatDate(lastWeekStart),
      to: formatDate(lastWeekEnd),
    }
  }
  const { from, to } = getLastWeekRange()

  return (
    <div className="bg-gradient-to-br from-[#1A1C26] via-black to-[#04d9ff] text-white">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Track Price Trends Across Markets
            </h1>
            <p className="mt-4 text-xl text-indigo-100 sm:text-2xl">
              Historical Price Indices for Luxury Goods, Collectibles, and More
            </p>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-indigo-50"
              >
                <Link href={`/detail/51?from=${from}&to=${to}`}>
                  See Gucci Index (Last Week)
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div
              className="absolute inset-0 bg-white/0 rounded-xl"
              aria-hidden="true"
            />
            <MinMaxChart
              title="Gucci - Average Price"
              from={"2024-09-08"}
              to={"2024-09-13"}
              data={exampleData}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
