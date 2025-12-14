"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Loader2 } from "lucide-react"

interface InputPanelProps {
  onRunAnalysis: (query: string, molecule?: string, geography?: string, agent?: string) => void
  isAnalyzing: boolean
}

export default function AnalysisInputPanel({ onRunAnalysis, isAnalyzing }: InputPanelProps) {
  const [query, setQuery] = useState("")
  const [molecule, setMolecule] = useState("")
  const [geography, setGeography] = useState("Global")
  const [selectedAgent, setSelectedAgent] = useState("All Agents")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onRunAnalysis(query, molecule, geography, selectedAgent)
    }
  }

  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0 pb-6 border-b">
        <CardTitle>New Analysis</CardTitle>
        <CardDescription>Type your question to analyze molecule opportunities</CardDescription>
      </CardHeader>

      <CardContent className="px-0 pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Main Query Input */}
          <div>
            <label htmlFor="query" className="text-sm font-medium text-foreground block mb-2">
              Your Question
            </label>
            <textarea
              id="query"
              placeholder="e.g., Find repurposing options for Molecule X in respiratory diseases"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-20 resize-none"
              disabled={isAnalyzing}
            />
          </div>

          {/* Optional Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="molecule" className="text-sm font-medium text-foreground block mb-2">
                Molecule (Optional)
              </label>
              <input
                id="molecule"
                type="text"
                placeholder="e.g., Aspirin"
                value={molecule}
                onChange={(e) => setMolecule(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={isAnalyzing}
              />
            </div>

            <div>
              <label htmlFor="geography" className="text-sm font-medium text-foreground block mb-2">
                Geography
              </label>
              <select
                id="geography"
                value={geography}
                onChange={(e) => setGeography(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={isAnalyzing}
              >
                <option>Global</option>
                <option>India</option>
                <option>US</option>
              </select>
            </div>
          </div>

          {/* Agent Selection */}
          <div>
            <label htmlFor="agent" className="text-sm font-medium text-foreground block mb-2">
              Select Agent
            </label>
            <select
              id="agent"
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={isAnalyzing}
            >
              <option>All Agents</option>
              <option>IQVIA Insights</option>
              <option>Clinical Trials</option>
              <option>Patent Analysis</option>
              <option>EXIM Trade</option>
              <option>Web Intelligence</option>
              <option>Internal Knowledge</option>
              <option>Innovation Strategy</option>
            </select>
            {selectedAgent === "Innovation Strategy" && (
              <p className="text-xs text-muted-foreground mt-2 bg-primary/10 p-2 rounded">
                ℹ️ Innovation Strategy requires data from all agents. All agents will run automatically.
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isAnalyzing || !query.trim()}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Running Analysis
              </>
            ) : (
              <>
                Run Agentic Analysis
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
