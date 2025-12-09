"use client"

import { BentoGrid, type BentoItem } from "@/components/ui/bento-grid"
import { MessageCircle, Network, FileText, Globe } from "lucide-react"

export default function HowItWorks() {
  const steps: BentoItem[] = [
    {
      title: "Smart Inquiry",
      meta: "Step 1",
      description: "Simply enter a molecule name or ask about portfolio opportunities to initiate the analysis.",
      icon: <MessageCircle className="w-4 h-4 text-blue-500" />,
      status: "Start",
      tags: ["Query", "Natural Language"],
      colSpan: 4,
      hasPersistentHover: true, // Key interaction point
    },
    {
      title: "Agent Orchestration",
      meta: "Step 2",
      description: "Master Agent instantly delegates tasks to specialized sub-agents.",
      icon: <Network className="w-4 h-4 text-purple-500" />,
      status: "Active",
      tags: ["AI", "Routing"],
      colSpan: 2,
    },
    {
      title: "Deep Data Retrieval",
      meta: "Step 3",
      description: "Workers search IQVIA, ClinicalTrials, Patents, and Web for real-time data.",
      icon: <Globe className="w-4 h-4 text-sky-500" />,
      status: "Processing",
      tags: ["Multi-source", "Real-time"],
      colSpan: 3,
    },
    {
      title: "Strategic Output",
      meta: "Step 4",
      description: "Receive a comprehensive dashboard and PDF report with actionable recommendations.",
      icon: <FileText className="w-4 h-4 text-emerald-500" />,
      status: "Complete",
      tags: ["Dashboard", "PDF"],
      colSpan: 3,
      hasPersistentHover: true, // End goal
    },
  ]

  return (
    <section id="how-it-works" className="py-20 px-4 md:py-24 bg-card/50 dark:bg-card/30 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">How it works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to unlock molecule insights
          </p>
        </div>

        <BentoGrid items={steps} />
      </div>
    </section>
  )
}
