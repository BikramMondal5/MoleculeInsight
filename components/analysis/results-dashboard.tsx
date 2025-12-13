"use client"
import { Button } from "@/components/ui/button"
import { Download, Archive } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import SummaryCard from "./dashboard/summary-card"
import MarketInsightsCard from "./dashboard/market-insights-card"
import ClinicalTrialsCard from "./dashboard/clinical-trials-card"
import PatentLandscapeCard from "./dashboard/patent-landscape-card"
import EXIMTrendsCard from "./dashboard/exim-trends-card"
import InternalInsightsCard from "./dashboard/internal-insights-card"
import InnovationConceptCard from "./dashboard/innovation-concept-card"
import InternalKnowledgeCard from "./dashboard/InternalKnowledgeCard"

interface ResultsDashboardProps {
  results: {
    iqvia?: { success: boolean; report?: string; error?: string }
    clinical_trials?: { success: boolean; report?: string; error?: string }
    patents?: { success: boolean; report?: string; error?: string }
    exim?: { success: boolean; report?: string; error?: string }
    web_intel?: { success: boolean; report?: string; error?: string }
    internal_knowledge?: { success: boolean; report?: string; error?: string }
    innovation_opportunities?: { success: boolean; report?: string; error?: string }
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

      {/* Results Carousel */}
      <div className="px-10">
        <Carousel className="w-full" opts={{ align: "start" }}>
          <CarouselContent className="-ml-4">
            <CarouselItem className="pl-4 md:basis-1/2 xl:basis-1/3">
              <SummaryCard results={results} molecule={molecule} />
            </CarouselItem>
            <CarouselItem className="pl-4 md:basis-1/2 xl:basis-1/3">
              <MarketInsightsCard data={results.iqvia} />
            </CarouselItem>
            <CarouselItem className="pl-4 md:basis-1/2 xl:basis-1/3">
              <ClinicalTrialsCard data={results.clinical_trials} />
            </CarouselItem>
            <CarouselItem className="pl-4 md:basis-1/2 xl:basis-1/3">
              <PatentLandscapeCard data={results.patents} />
            </CarouselItem>
            <CarouselItem className="pl-4 md:basis-1/2 xl:basis-1/3">
              <EXIMTrendsCard data={results.exim} />
            </CarouselItem>
            <CarouselItem className="pl-4 md:basis-1/2 xl:basis-1/3">
              <InternalKnowledgeCard data={results.internal_knowledge} />
            </CarouselItem>
            <CarouselItem className="pl-4 md:basis-1/2 xl:basis-1/3">
              <InternalInsightsCard data={results.web_intel} />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Innovation Opportunities - Footer Section */}
      <div className="mt-12 px-10">
        <InnovationConceptCard
          data={results.innovation_opportunities}
          molecule={molecule}
        />
      </div>
    </div>
  )
}