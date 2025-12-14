"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Archive } from "lucide-react"
import SummaryCard from "./dashboard/summary-card"
import MarketInsightsCard from "./dashboard/market-insights-card"
import ClinicalTrialsCard from "./dashboard/clinical-trials-card"
import PatentLandscapeCard from "./dashboard/patent-landscape-card"
import EXIMTrendsCard from "./dashboard/exim-trends-card"
import InternalInsightsCard from "./dashboard/internal-insights-card"
import InnovationConceptCard from "./dashboard/innovation-concept-card"
import InternalKnowledgeCard from "./dashboard/InternalKnowledgeCard"
import jsPDF from "jspdf"
import { useToast } from "@/hooks/use-toast"

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
  query: string
  region: string
}

export default function ResultsDashboard({ results, molecule, query, region }: ResultsDashboardProps) {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const handleDownloadPDF = () => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margins = 20
    const maxLineWidth = pageWidth - (margins * 2)
    let yPosition = 20

    // Helper function to convert markdown to plain text
    const markdownToPlainText = (markdown: string): string => {
      return markdown
        // Remove headers (###, ##, #)
        .replace(/^#{1,6}\s+/gm, '')
        // Remove bold (**text** or __text__)
        .replace(/(\*\*|__)(.*?)\1/g, '$2')
        // Remove italic (*text* or _text_)
        .replace(/(\*|_)(.*?)\1/g, '$2')
        // Remove links [text](url)
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        // Remove inline code (`code`)
        .replace(/`([^`]+)`/g, '$1')
        // Remove code blocks (```code```)
        .replace(/```[\s\S]*?```/g, '')
        // Remove horizontal rules (---, ***)
        .replace(/^(-{3,}|\*{3,})$/gm, '')
        // Convert list items (-, *, +) to bullets
        .replace(/^[\s]*[-*+]\s+/gm, '• ')
        // Clean up extra whitespace
        .replace(/\n{3,}/g, '\n\n')
        .trim()
    }

    // Add main title
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    pdf.text(`Analysis Results - ${molecule}`, margins, yPosition)
    yPosition += 15

    // Helper function to add section
    const addSection = (title: string, content: string) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 40) {
        pdf.addPage()
        yPosition = 20
      }

      // Add section title
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text(title, margins, yPosition)
      yPosition += 8

      // Convert markdown to plain text
      const plainText = markdownToPlainText(content)

      // Add content
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')

      const lines = pdf.splitTextToSize(plainText, maxLineWidth)
      const lineHeight = 6

      lines.forEach((line: string) => {
        if (yPosition + lineHeight > pageHeight - 20) {
          pdf.addPage()
          yPosition = 20
        }
        pdf.text(line, margins, yPosition)
        yPosition += lineHeight
      })

      yPosition += 10 // Space between sections
    }

    // Add all sections
    if (results.iqvia?.success && results.iqvia.report) {
      addSection('Market Insights (IQVIA)', results.iqvia.report)
    }

    if (results.clinical_trials?.success && results.clinical_trials.report) {
      addSection('Clinical Trials', results.clinical_trials.report)
    }

    if (results.patents?.success && results.patents.report) {
      addSection('Patent Landscape', results.patents.report)
    }

    if (results.exim?.success && results.exim.report) {
      addSection('EXIM Trends', results.exim.report)
    }

    if (results.internal_knowledge?.success && results.internal_knowledge.report) {
      addSection('Internal Knowledge', results.internal_knowledge.report)
    }

    if (results.web_intel?.success && results.web_intel.report) {
      addSection('Web Intelligence', results.web_intel.report)
    }

    if (results.innovation_opportunities?.success && results.innovation_opportunities.report) {
      // Parse JSON and format as readable text
      try {
        const opportunities = JSON.parse(results.innovation_opportunities.report)
        let formattedText = 'Based on comprehensive analysis across market insights, clinical trials, patents, trade data, and web intelligence:\n\n'

        opportunities.forEach((opportunity: { title: string; description: string }, index: number) => {
          formattedText += `${index + 1}. ${opportunity.title}\n${opportunity.description}\n\n`
        })

        addSection('Innovation Opportunities', formattedText)
      } catch (e) {
        // If parsing fails, use raw report
        addSection('Innovation Opportunities', results.innovation_opportunities.report)
      }
    }

    // Download PDF
    const fileName = `${molecule.replace(/[^a-z0-9]/gi, '_')}_analysis_report.pdf`
    pdf.save(fileName)
  }

  const handleSaveArchive = async () => {
    try {
      setIsSaving(true)

      // Generate PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margins = 20
      const maxLineWidth = pageWidth - (margins * 2)
      let yPosition = 20

      // Helper function to convert markdown to plain text
      const markdownToPlainText = (markdown: string): string => {
        return markdown
          .replace(/^#{1,6}\s+/gm, '')
          .replace(/(\*\*|__)(.*?)\1/g, '$2')
          .replace(/(\*|_)(.*?)\1/g, '$2')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .replace(/`([^`]+)`/g, '$1')
          .replace(/```[\s\S]*?```/g, '')
          .replace(/^(-{3,}|\*{3,})$/gm, '')
          .replace(/^[\s]*[-*+]\s+/gm, '• ')
          .replace(/\n{3,}/g, '\n\n')
          .trim()
      }

      // Add main title
      pdf.setFontSize(20)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`Analysis Results - ${molecule}`, margins, yPosition)
      yPosition += 15

      // Helper function to add section
      const addSection = (title: string, content: string) => {
        if (yPosition > pageHeight - 40) {
          pdf.addPage()
          yPosition = 20
        }

        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.text(title, margins, yPosition)
        yPosition += 8

        const plainText = markdownToPlainText(content)
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')

        const lines = pdf.splitTextToSize(plainText, maxLineWidth)
        const lineHeight = 6

        lines.forEach((line: string) => {
          if (yPosition + lineHeight > pageHeight - 20) {
            pdf.addPage()
            yPosition = 20
          }
          pdf.text(line, margins, yPosition)
          yPosition += lineHeight
        })

        yPosition += 10
      }

      // Add all sections
      if (results.iqvia?.success && results.iqvia.report) {
        addSection('Market Insights (IQVIA)', results.iqvia.report)
      }
      if (results.clinical_trials?.success && results.clinical_trials.report) {
        addSection('Clinical Trials', results.clinical_trials.report)
      }
      if (results.patents?.success && results.patents.report) {
        addSection('Patent Landscape', results.patents.report)
      }
      if (results.exim?.success && results.exim.report) {
        addSection('EXIM Trends', results.exim.report)
      }
      if (results.internal_knowledge?.success && results.internal_knowledge.report) {
        addSection('Internal Knowledge', results.internal_knowledge.report)
      }
      if (results.web_intel?.success && results.web_intel.report) {
        addSection('Web Intelligence', results.web_intel.report)
      }
      if (results.innovation_opportunities?.success && results.innovation_opportunities.report) {
        try {
          const opportunities = JSON.parse(results.innovation_opportunities.report)
          let formattedText = 'Based on comprehensive analysis across market insights, clinical trials, patents, trade data, and web intelligence:\n\n'
          opportunities.forEach((opportunity: { title: string; description: string }, index: number) => {
            formattedText += `${index + 1}. ${opportunity.title}\n${opportunity.description}\n\n`
          })
          addSection('Innovation Opportunities', formattedText)
        } catch (e) {
          addSection('Innovation Opportunities', results.innovation_opportunities.report)
        }
      }

      // Get PDF as base64
      const pdfBase64 = pdf.output('datauristring').split(',')[1]

      // Save to archive
      const response = await fetch('/api/archive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportName: `${molecule} - ${region} Analysis`,
          molecule,
          query,
          region,
          pdfData: pdfBase64,
          results,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "Success!",
          description: "Report saved to archive successfully.",
        })
      } else {
        throw new Error(data.error || 'Failed to save to archive')
      }
    } catch (error) {
      console.error('Save to archive error:', error)
      toast({
        title: "Error",
        description: "Failed to save report to archive. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
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
          <Button variant="outline" size="sm" onClick={handleSaveArchive} disabled={isSaving}>
            <Archive className="w-4 h-4 mr-2" />
            Save to Archive
          </Button>
        </div>
      </div>

      {/* Dashboard Grid - Playing Card Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <SummaryCard results={results} molecule={molecule} />
        <MarketInsightsCard data={results.iqvia} />
        <ClinicalTrialsCard data={results.clinical_trials} />
        <PatentLandscapeCard data={results.patents} />
        <EXIMTrendsCard data={results.exim} />
        <InternalKnowledgeCard data={results.internal_knowledge} />
        <InternalInsightsCard data={results.web_intel} />
      </div>

      {/* Innovation Opportunities - Full Width */}
      <div className="mt-6">
        <InnovationConceptCard
          data={results.innovation_opportunities}
          molecule={molecule}
        />
      </div>
    </div>
  )
}