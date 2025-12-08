"use client"

import { Card } from "@/components/ui/card"

export default function TechnologyStack() {
  const technologies = [
    {
      category: "AI & Orchestration",
      items: ["Multi-Agent Architecture", "LLM Coordination", "Real-time Processing"],
    },
    {
      category: "Data Sources",
      items: ["IQVIA Market Data", "ClinicalTrials.gov", "Patent Databases", "Global Trade Data"],
    },
    {
      category: "Infrastructure",
      items: ["Parallel Processing", "Cloud-Native", "Real-time Updates"],
    },
  ]

  return (
    <section className="bg-card rounded-xl border p-8">
      <h2 className="text-2xl font-bold text-foreground mb-8">Technology Stack</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {technologies.map((tech, idx) => (
          <Card key={idx} className="p-6">
            <h3 className="font-semibold text-foreground mb-4">{tech.category}</h3>
            <ul className="space-y-2">
              {tech.items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex gap-2 text-sm">
                  <span className="text-primary">•</span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </section>
  )
}
