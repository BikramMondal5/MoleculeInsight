"use client"

import Link from "next/link"
import { Beaker, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import AgentArchitecture from "@/components/about/agent-architecture"
import FlowDiagram from "@/components/about/flow-diagram"
import TechnologyStack from "@/components/about/technology-stack"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full bg-background/95 backdrop-blur border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-primary rounded-lg group-hover:bg-primary/90 transition-colors">
              <Beaker className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">Molecule Innovation Scout</span>
          </Link>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/analysis">Start Analysis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="px-4 md:px-6 mb-20">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">How Agentic AI Powers Your Research</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Molecule Innovation Scout uses an orchestrated network of AI agents to rapidly analyze drug-repurposing
              opportunities across multiple data sources in minutes, not weeks.
            </p>
          </div>
        </section>

        {/* Agent Architecture Diagram */}
        <section className="px-4 md:px-6 mb-20">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">System Architecture</h2>
              <p className="text-muted-foreground">
                Our 8-agent system works together to provide comprehensive insights
              </p>
            </div>
            <AgentArchitecture />
          </div>
        </section>

        {/* Data Flow Diagram */}
        <section className="px-4 md:px-6 mb-20">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Information Flow</h2>
              <p className="text-muted-foreground">From query to actionable insights in real-time</p>
            </div>
            <FlowDiagram />
          </div>
        </section>

        {/* Technology Stack */}
        <section className="px-4 md:px-6 mb-20">
          <div className="max-w-6xl mx-auto">
            <TechnologyStack />
          </div>
        </section>

        {/* Agent Details */}
        <section className="px-4 md:px-6 mb-20 bg-card/30 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Meet Your AI Agents</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card rounded-xl border p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">Master Agent</h3>
                <p className="text-muted-foreground mb-4">
                  Orchestrates the entire analysis workflow. Decomposes your research question into specific tasks and
                  coordinates worker agents to gather comprehensive insights.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Interprets research objectives</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Coordinates worker agents</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Synthesizes final report</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card rounded-xl border p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">IQVIA Market Intelligence Agent</h3>
                <p className="text-muted-foreground mb-4">
                  Accesses real-time market data including patient populations, disease prevalence, treatment patterns,
                  and competitive landscape analysis.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Market size & CAGR</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Treatment patterns</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Competitor analysis</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card rounded-xl border p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">Clinical Trials Agent</h3>
                <p className="text-muted-foreground mb-4">
                  Searches global clinical trial databases to identify relevant trials, phases, enrollment status, and
                  trial outcome data for your molecule.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Active trial identification</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Phase & enrollment data</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Outcome analysis</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card rounded-xl border p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">Patent Intelligence Agent</h3>
                <p className="text-muted-foreground mb-4">
                  Analyzes patent landscapes including expiration dates, freedom-to-operate risks, and competitive
                  patent positions.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Patent expiration tracking</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>FTO risk assessment</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Competitive patents</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card rounded-xl border p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">EXIM Trends Agent</h3>
                <p className="text-muted-foreground mb-4">
                  Analyzes import/export data, regulatory approvals by country, and international market opportunities
                  for your molecule.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Global trade patterns</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Regional regulatory status</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Market entry barriers</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card rounded-xl border p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Web Intelligence & Internal Knowledge Agents
                </h3>
                <p className="text-muted-foreground mb-4">
                  Crawl web sources and access internal documents to gather additional context, company insights, and
                  emerging trends.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Web intelligence gathering</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Internal knowledge base</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Emerging trend detection</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 md:px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">Ready to start your analysis?</h2>
            <Button size="lg" className="gap-2" asChild>
              <Link href="/analysis">
                Start Analysis
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
