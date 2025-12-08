"use client"

import { Card } from "@/components/ui/card"
import { MessageCircle, Network, FileText } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "User asks a question",
      description: "Enter a molecule name or ask about portfolio opportunities",
      icon: MessageCircle,
    },
    {
      number: "2",
      title: "AI Agents research across data sources",
      description: "Master Agent orchestrates Workers across IQVIA, ClinicalTrials, Patents, and Web Intelligence",
      icon: Network,
    },
    {
      number: "3",
      title: "You get dashboard + PDF report",
      description: "Live cards show insights and actionable recommendations in one place",
      icon: FileText,
    },
  ]

  return (
    <section id="how-it-works" className="py-20 px-4 md:py-24 bg-card/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">How it works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to unlock molecule insights
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div key={idx} className="relative">
                <Card className="p-8 h-full">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-primary mb-2">Step {step.number}</div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </Card>

                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/20 to-transparent" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
