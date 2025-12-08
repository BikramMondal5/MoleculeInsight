"use client"

import { Card } from "@/components/ui/card"
import { Beaker, TrendingUp, ScrollText as Strategy } from "lucide-react"

export default function WhoIsItFor() {
  const audiences = [
    {
      title: "R&D Teams",
      description:
        "Accelerate drug discovery by rapidly evaluating repurposing opportunities with comprehensive data insights.",
      icon: Beaker,
    },
    {
      title: "Business Development",
      description:
        "Identify strategic partnerships and licensing opportunities with market and clinical data at your fingertips.",
      icon: TrendingUp,
    },
    {
      title: "Strategy Teams",
      description:
        "Make data-driven decisions on portfolio investments and product launches with competitive intelligence.",
      icon: Strategy,
    },
  ]

  return (
    <section className="py-20 px-4 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Who is it for?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for teams driving innovation in pharmaceutical research and development
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {audiences.map((audience, idx) => {
            const Icon = audience.icon
            return (
              <Card key={idx} className="p-8 hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{audience.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{audience.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
