"use client"

import { Card } from "@/components/ui/card"

export default function AgentArchitecture() {
  const agents = [
    { name: "IQVIA\nMarket", color: "bg-blue-500/20 border-blue-500/50" },
    { name: "Clinical\nTrials", color: "bg-green-500/20 border-green-500/50" },
    { name: "Patent\nLandscape", color: "bg-purple-500/20 border-purple-500/50" },
    { name: "EXIM\nTrends", color: "bg-orange-500/20 border-orange-500/50" },
    { name: "Web\nIntelligence", color: "bg-cyan-500/20 border-cyan-500/50" },
    { name: "Internal\nKnowledge", color: "bg-indigo-500/20 border-indigo-500/50" },
    { name: "Report\nGenerator", color: "bg-pink-500/20 border-pink-500/50" },
  ]

  return (
    <div className="bg-card rounded-xl border p-12">
      <div className="flex flex-col items-center gap-8">
        {/* Input Arrow */}
        <div className="text-center">
          <div className="text-sm font-semibold text-muted-foreground mb-2">User Query</div>
          <div className="w-0.5 h-8 bg-gradient-to-b from-primary/50 to-transparent mx-auto"></div>
        </div>

        {/* Master Agent */}
        <div className="relative mb-4">
          <Card className="p-8 bg-primary/10 border-primary/50 min-w-48">
            <div className="text-center">
              <div className="text-sm font-bold text-primary mb-1">MASTER AGENT</div>
              <div className="text-lg font-semibold text-foreground">Orchestrator</div>
              <div className="text-xs text-muted-foreground mt-2">Coordinates all workers</div>
            </div>
          </Card>

          {/* Lines from Master to Workers */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gradient-to-b from-primary/30 to-transparent"></div>
        </div>

        {/* Worker Agents Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          {agents.map((agent, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              {/* Connection lines */}
              <div className="w-0.5 h-4 bg-primary/30"></div>

              <Card
                className={`p-4 text-center min-h-24 flex items-center justify-center border ${agent.color} w-full`}
              >
                <div>
                  <div className="text-xs font-bold text-foreground whitespace-pre-line leading-tight">
                    {agent.name}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Lines back to Master */}
        <div className="w-0.5 h-6 bg-gradient-to-b from-transparent to-primary/30"></div>

        {/* Master Agent again for return data */}
        <div className="relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gradient-to-t from-primary/30 to-transparent"></div>

          <Card className="p-4 text-center bg-primary/5 border-primary/30 min-w-48">
            <div className="text-xs text-muted-foreground">Data synthesis</div>
          </Card>
        </div>

        {/* Output Arrow */}
        <div className="text-center w-full">
          <div className="w-0.5 h-8 bg-gradient-to-b from-transparent to-primary/50 mx-auto mb-2"></div>
          <div className="text-sm font-semibold text-muted-foreground">Dashboard & Report</div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 pt-8 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-primary/50 flex-shrink-0"></div>
            <span className="text-muted-foreground">Master Agent</span>
          </div>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500/50 flex-shrink-0"></div>
            <span className="text-muted-foreground">Worker Agents</span>
          </div>
        </div>
      </div>
    </div>
  )
}
