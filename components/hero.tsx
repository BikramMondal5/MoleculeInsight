"use client"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Particles } from "@/components/ui/particles"

export default function Hero() {
  const { theme } = useTheme()
  const [color, setColor] = useState("#000000")

  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#000000")
  }, [theme])

  return (
    <section className="pt-32 pb-20 px-4 md:pt-40 md:pb-24 relative overflow-hidden">
      {/* Background gradient effects for dark mode */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <Particles
        className="absolute inset-0 z-0"
        quantity={150}
        size={1.2}
        ease={80}
        color={color}
        refresh
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-border bg-card/80 backdrop-blur-sm shadow-sm">
          <p className="text-xs md:text-sm font-medium text-muted-foreground">⚡ Powered by Agentic AI</p>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground leading-tight text-balance">
          <span className="bg-gradient-to-r from-[#6A85FF] to-[#3CF57A] bg-clip-text text-transparent">Agentic AI</span> for Faster Molecule Repurposing
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance">
          Enter a molecule and get market, trials, patents and innovation opportunities in minutes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-8 shadow-lg shadow-primary/25">
            Start Analysis
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="lg" className="px-8 bg-background/50 backdrop-blur-sm border-border hover:bg-accent">
            View Demo
          </Button>
        </div>
      </div>
    </section>
  )
}
