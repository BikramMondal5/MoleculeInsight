"use client"
import { Button } from "@/components/ui/button"
import { Download, Archive } from "lucide-react"
import SummaryCard from "./dashboard/summary-card"
import MarketInsightsCard from "./dashboard/market-insights-card"
import ClinicalTrialsCard from "./dashboard/clinical-trials-card"
import PatentLandscapeCard from "./dashboard/patent-landscape-card"
import EXIMTrendsCard from "./dashboard/exim-trends-card"
import InternalInsightsCard from "./dashboard/internal-insights-card"
import InnovationConceptCard from "./dashboard/innovation-concept-card"

interface ResultsDashboardProps {
  results: {
    iqvia?: { success: boolean; report?: string; error?: string }
    clinical_trials?: { success: boolean; report?: string; error?: string }
    patents?: { success: boolean; report?: string; error?: string }
    exim?: { success: boolean; report?: string; error?: string }
    web_intel?: { success: boolean; report?: string; error?: string }
  }
  molecule: string
}

export default function ResultsDashboard({ results, molecule }: ResultsDashboardProps) {
  const handleDownloadPDF = () => {
    console.log("[v0] Download PDF clicked")
    // TODO: Implement PDF generation
  }

  const handleSaveArchive = () => {
    console.log("[v0] Save to Archive clicked")
    // TODO: Implement archive functionality
  }

  return (
    <div className="mt-12 pb-12">
      {/* Header with action buttons */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analysis Results</h2>
          <p className="text-muted-foreground mt-1">
            Complete insights and recommendations for {molecule}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleSaveArchive}>
            <Archive className="w-4 h-4 mr-2" />
            Save to Archive
          </Button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SummaryCard results={results} molecule={molecule} />
        <MarketInsightsCard data={results.iqvia} />
        <ClinicalTrialsCard data={results.clinical_trials} />
        <PatentLandscapeCard data={results.patents} />
        <EXIMTrendsCard data={results.exim} />
        <InternalInsightsCard data={results.web_intel} />
      </div>

      {/* Innovation Concept - Full Width */}
      <div className="mt-6">
        <InnovationConceptCard results={results} molecule={molecule} />
      </div>
    </div>
  )
}
