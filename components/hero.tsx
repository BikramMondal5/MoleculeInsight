"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 md:pt-40 md:pb-24">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-border bg-card">
          <p className="text-xs md:text-sm font-medium text-muted-foreground">Powered by Agentic AI</p>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground leading-tight text-balance">
          Agentic AI for Faster Molecule Repurposing
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance">
          Enter a molecule and get market, trials, patents and innovation opportunities in minutes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-8">
            Start Analysis
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="lg" className="px-8 bg-transparent">
            View Demo
          </Button>
        </div>
      </div>
    </section>
  )
}
