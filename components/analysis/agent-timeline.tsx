"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle, Loader2 } from "lucide-react"

interface AgentTimelineProps {
  activeAgents: string[]
  isAnalyzing: boolean
}

export default function AgentTimeline({ activeAgents, isAnalyzing }: AgentTimelineProps) {
  const agents = [
    { name: "Master Agent", icon: "🎯" },
    { name: "IQVIA Insights Agent", icon: "📊" },
    { name: "EXIM Agent", icon: "🌍" },
    { name: "Clinical Trials Agent", icon: "🏥" },
    { name: "Patent Agent", icon: "⚖️" },
    { name: "Web Intelligence Agent", icon: "🔍" },
    { name: "Internal Knowledge Agent", icon: "💾" },
    { name: "Report Generator Agent", icon: "📄" },
  ]

  const getAgentStatus = (agentName: string) => {
    const index = agents.findIndex((a) => a.name === agentName)
    const activeIndex = activeAgents.findIndex((a) => a === agentName)

    if (activeIndex >= 0) {
      if (activeIndex === activeAgents.length - 1 && !isAnalyzing) {
        return "completed"
      }
      return "active"
    }
    if (activeAgents.length > 0 && index < agents.findIndex((a) => a.name === activeAgents[0])) {
      return "completed"
    }
    return "pending"
  }

  return (
    <Card className="h-fit">
      <CardHeader className="border-b">
        <CardTitle className="text-lg">Agent Progress</CardTitle>
        <CardDescription>
          {activeAgents.length === 0 ? "Ready to analyze" : `${activeAgents.length} agent(s) active`}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <div className="space-y-3 p-4">
          {agents.map((agent, idx) => {
            const status = getAgentStatus(agent.name)
            return (
              <div key={agent.name} className="flex items-start gap-3">
                <div className="flex-shrink-0 pt-0.5">
                  {status === "completed" && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                  {status === "active" && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
                  {status === "pending" && <Circle className="w-5 h-5 text-border" />}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      status === "pending" ? "text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {agent.name}
                  </p>
                </div>

                {status !== "pending" && (
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {status === "completed" ? "Done" : "Running"}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
