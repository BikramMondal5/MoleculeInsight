import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"

interface SummaryCardProps {
  results: {
    iqvia?: { success: boolean; report?: string }
    clinical_trials?: { success: boolean; report?: string }
    patents?: { success: boolean; report?: string }
    exim?: { success: boolean; report?: string }
    web_intel?: { success: boolean; report?: string }
    internal_knowledge?: { success: boolean; report?: string }
  }
  molecule: string
}

export default function SummaryCard({ results, molecule }: SummaryCardProps) {
  const agentStatus = [
    { name: "Market Insights", success: results.iqvia?.success },
    { name: "Clinical Trials", success: results.clinical_trials?.success },
    { name: "Patents", success: results.patents?.success },
    { name: "Trade Data", success: results.exim?.success },
    { name: "Web Intelligence", success: results.web_intel?.success },
    { name: "Internal Knowledge", success: results.internal_knowledge?.success },
  ]

  const successCount = agentStatus.filter((a) => a.success).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Executive Summary - {molecule}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground leading-relaxed">
          Analysis completed for <strong>{molecule}</strong> using multiple intelligence agents.
          {successCount === 6
            ? " All data sources processed successfully."
            : ` ${successCount}/5 data sources processed successfully.`}
        </p>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">Agent Status:</p>
          <div className="grid grid-cols-2 gap-2">
            {agentStatus.map((agent) => (
              <div key={agent.name} className="flex items-center gap-2 text-xs">
                {agent.success ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                <span className={agent.success ? "text-foreground" : "text-muted-foreground"}>
                  {agent.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground pt-2">
          Review the detailed insights in each section below. Data is sourced from FDA, ClinicalTrials.gov,
          PatentsView, UN Comtrade, and news APIs.
        </p>
      </CardContent>
    </Card>
  )
}
