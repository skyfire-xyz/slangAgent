import { TrendingUp } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

import Hero from "./detail/[id]/components/hero"
import { DataTable } from "./table"

export default function IndexPage() {
  return (
    <>
      <section>
        <Hero />
      </section>
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      </section>
    </>
  )
}
