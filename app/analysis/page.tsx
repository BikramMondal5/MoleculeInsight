"use client"

import { useState } from "react"
import AnalysisHeader from "@/components/analysis/header"
import AnalysisInputPanel from "@/components/analysis/input-panel"
import ChatPanel from "@/components/analysis/chat-panel"
import AgentTimeline from "@/components/analysis/agent-timeline"
import ResultsDashboard from "@/components/analysis/results-dashboard"

interface AnalysisResults {
  iqvia?: { success: boolean; report?: string; error?: string }
  clinical_trials?: { success: boolean; report?: string; error?: string }
  patents?: { success: boolean; report?: string; error?: string }
  exim?: { success: boolean; report?: string; error?: string }
  web_intel?: { success: boolean; report?: string; error?: string }
  internal_knowledge?: { success: boolean; report?: string; error?: string }
}

export default function AnalysisPage() {
  const [messages, setMessages] = useState<
    Array<{ id: string; role: "user" | "agent"; agent?: string; content: string }>
  >([])
  const [activeAgents, setActiveAgents] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null)
  const [currentMolecule, setCurrentMolecule] = useState<string>("")

  const handleRunAnalysis = async (query: string, molecule?: string, geography?: string) => {
    setIsAnalyzing(true)
    setAnalysisComplete(false)
    setMessages([])
    setActiveAgents([])
    setAnalysisResults(null)

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: "user-1",
        role: "user",
        content: query,
      },
    ])

    // Show agent timeline updates
    const agents = [
      { name: "Master Agent", desc: "Decomposing your query..." },
      { name: "IQVIA Insights Agent", desc: "Analyzing market data..." },
      { name: "EXIM Agent", desc: "Checking export/import opportunities..." },
      { name: "Clinical Trials Agent", desc: "Searching clinical trials..." },
      { name: "Patent Agent", desc: "Analyzing patent landscape..." },
      { name: "Web Intelligence Agent", desc: "Gathering web insights..." },
      { name: "Internal Knowledge Agent", desc: "Analyzing internal knowledge base..." },
      { name: "Report Generator Agent", desc: "Compiling report..." },
    ]

    // Simulate agent activation for UI feedback
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
      }, idx * 300)
    })

    try {
      // Call the API
      const response = await fetch("/api/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          molecule: molecule || "",
          geography: geography || "Global",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze molecule")
      }

      // Update results
      setAnalysisResults(data.results)
      setCurrentMolecule(data.molecule || molecule || "Unknown")
      setAnalysisComplete(true)

      // Add completion message
      setMessages((prev) => [
        ...prev,
        {
          id: "summary",
          role: "agent",
          agent: "Report Generator Agent",
          content: "Analysis complete. Dashboard updated with insights and recommendations.",
        },
      ])
    } catch (error) {
      console.error("Analysis error:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: "error",
          role: "agent",
          agent: "System",
          content: `Error: ${error instanceof Error ? error.message : "Failed to complete analysis"}. Please make sure the FastAPI backend is running.`,
        },
      ])
    } finally {
      setIsAnalyzing(false)
    }
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

          {analysisComplete && analysisResults && (
            <ResultsDashboard results={analysisResults} molecule={currentMolecule} />
          )}
        </div>
      </div>
    </div>
  )
}
