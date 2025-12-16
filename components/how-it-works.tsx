"use client"

import { BentoGrid, type BentoItem } from "@/components/ui/bento-grid"
import { MessageCircle, Network, FileText, Globe } from "lucide-react"

export default function HowItWorks() {
  const steps: BentoItem[] = [
    {
      title: "Define Your Research Focus",
      meta: "Step 1",
      description: "Initiate your study by entering a molecule name or research topic. Our system supports natural language queries for seamless exploration.",
      icon: <MessageCircle className="w-4 h-4 text-blue-500" />,
      status: "Start",
      tags: ["Research Query", "Molecule Search"],
      colSpan: 4,
      hasPersistentHover: true,
    },
    {
      title: "Multi-Agent Orchestration",
      meta: "Step 2",
      description: "A team of AI agents simultaneously analyzes clinical trials, patents, trade data, and market intelligence.",
      icon: <Network className="w-4 h-4 text-purple-500" />,
      status: "Active",
      tags: ["Parallel Processing", "Deep Analysis"],
      colSpan: 2,
    },
    {
      title: "RAG & Knowledge Synthesis",
      meta: "Step 3",
      description: "The RAG engine fuses internal knowledge bases with external sources like Wikipedia to generate context-aware, scientific insights.",
      icon: <Globe className="w-4 h-4 text-sky-500" />,
      status: "Processing",
      tags: ["Data Synthesis", "Contextual AI"],
      colSpan: 3,
    },
    {
      title: "Interactive Visualization & Reporting",
      meta: "Step 4",
      description: "Explore 3D molecular structures, analyze real-time dashboards, and export comprehensive PDF reports for your publication or thesis.",
      icon: <FileText className="w-4 h-4 text-emerald-500" />,
      status: "Complete",
      tags: ["3D Viewer", "Thesis Ready"],
      colSpan: 3,
      hasPersistentHover: true,
    },
  ]

  return (
    <section id="how-it-works" className="py-20 px-4 md:py-24 bg-card/50 dark:bg-card/30 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-teal-500">How it works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to unlock molecule insights
          </p>
        </div>

        <BentoGrid items={steps} />
      </div>
    </section>
  )
}
