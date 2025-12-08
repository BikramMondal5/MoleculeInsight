"use client"

import { ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function FlowDiagram() {
  const steps = [
    {
      title: "User Query",
      description: "Enter molecule name and research context",
      icon: "📝",
    },
    {
      title: "Master Agent",
      description: "Decomposes request into tasks",
      icon: "🧠",
    },
    {
      title: "Worker Agents",
      description: "Research across all data sources in parallel",
      icon: "⚙️",
    },
    {
      title: "Data Synthesis",
      description: "Master Agent combines all insights",
      icon: "📊",
    },
    {
      title: "Results Dashboard",
      description: "Live cards with insights and recommendations",
      icon: "✨",
    },
  ]

  return (
    <div className="bg-card rounded-xl border p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-2 flex-wrap">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-4 w-full md:w-auto">
            <Card className="p-4 text-center min-w-40">
              <div className="text-2xl mb-2">{step.icon}</div>
              <h3 className="font-semibold text-foreground text-sm">{step.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
            </Card>

            {idx < steps.length - 1 && (
              <div className="hidden md:flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-primary/50 flex-shrink-0" />
              </div>
            )}

            {idx < steps.length - 1 && (
              <div className="md:hidden w-full flex justify-center py-2">
                <div className="w-0.5 h-6 bg-primary/30"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-border">
        <h4 className="font-semibold text-foreground mb-3">Key Benefits</h4>
        <ul className="grid md:grid-cols-3 gap-4 text-sm">
          <li className="flex gap-2">
            <span className="text-primary">✓</span>
            <span className="text-muted-foreground">
              <strong>Minutes, not weeks:</strong> Get comprehensive analysis in under 5 minutes
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">✓</span>
            <span className="text-muted-foreground">
              <strong>Multi-source data:</strong> All insights from one integrated system
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">✓</span>
            <span className="text-muted-foreground">
              <strong>Real-time transparency:</strong> Watch agents work in real-time
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
