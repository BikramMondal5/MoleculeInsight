"use client"

import { useState } from "react"
import AnalysisHeader from "@/components/analysis/header"
import AnalysisInputPanel from "@/components/analysis/input-panel"
import ChatPanel from "@/components/analysis/chat-panel"
import AgentTimeline from "@/components/analysis/agent-timeline"
import ResultsDashboard from "@/components/analysis/results-dashboard"

export default function AnalysisPage() {
  const [messages, setMessages] = useState<
    Array<{ id: string; role: "user" | "agent"; agent?: string; content: string }>
  >([])
  const [activeAgents, setActiveAgents] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)

  const handleRunAnalysis = (query: string, molecule?: string, geography?: string) => {
    setIsAnalyzing(true)
    setAnalysisComplete(false)
    setMessages([])
    setActiveAgents([])

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: "user-1",
        role: "user",
        content: query,
      },
    ])

    // Simulate agents running
    const agents = [
      { name: "Master Agent", desc: "Decomposing your query..." },
      { name: "IQVIA Insights Agent", desc: "Analyzing market data..." },
      { name: "EXIM Agent", desc: "Checking export/import opportunities..." },
      { name: "Clinical Trials Agent", desc: "Searching clinical trials..." },
      { name: "Patent Agent", desc: "Analyzing patent landscape..." },
      { name: "Web Intelligence Agent", desc: "Gathering web insights..." },
      { name: "Internal Knowledge Agent", desc: "Accessing internal database..." },
      { name: "Report Generator Agent", desc: "Compiling report..." },
    ]

    agents.forEach((agent, idx) => {
      setTimeout(() => {
        setActiveAgents((prev) => [...prev, agent.name])
        setMessages((prev) => [
          ...prev,
          {
            id: `agent-${idx}`,
            role: "agent",
            agent: agent.name,
            content: agent.desc,
          },
        ])
      }, idx * 500)
    })

    setTimeout(
      () => {
        setIsAnalyzing(false)
        setAnalysisComplete(true)
        setMessages((prev) => [
          ...prev,
          {
            id: "summary",
            role: "agent",
            agent: "Report Generator Agent",
            content: "Analysis complete. Dashboard updated with insights and recommendations.",
          },
        ])
      },
      agents.length * 500 + 1000,
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AnalysisHeader />
      <div className="pt-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">New Analysis</h1>
            <p className="text-muted-foreground">
              Enter a molecule and get market, trials, patents and innovation opportunities in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Input Panel */}
            <div className="lg:col-span-2">
              <AnalysisInputPanel onRunAnalysis={handleRunAnalysis} isAnalyzing={isAnalyzing} />
            </div>

            {/* Agent Timeline */}
            <div className="lg:col-span-1">
              <AgentTimeline activeAgents={activeAgents} isAnalyzing={isAnalyzing} />
            </div>
          </div>

          {/* Chat Panel */}
          {messages.length > 0 && <ChatPanel messages={messages} isAnalyzing={isAnalyzing} />}

          {analysisComplete && <ResultsDashboard />}
        </div>
      </div>
    </div>
  )
}
