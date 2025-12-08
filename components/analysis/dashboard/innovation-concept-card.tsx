import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface InnovationConceptCardProps {
  results: {
    iqvia?: { success: boolean }
    clinical_trials?: { success: boolean }
    patents?: { success: boolean }
    exim?: { success: boolean }
    web_intel?: { success: boolean }
  }
  molecule: string
}

export default function InnovationConceptCard({ results, molecule }: InnovationConceptCardProps) {
  const hasMarketData = results.iqvia?.success
  const hasClinicalData = results.clinical_trials?.success
  const hasPatentData = results.patents?.success
  const hasTradeData = results.exim?.success

  return (
    <Card className="border-primary border-2 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-primary">Innovation Opportunities for {molecule}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground leading-relaxed">
          Based on the comprehensive analysis, here are potential innovation opportunities:
        </p>
        <ul className="space-y-3 text-sm">
          {hasMarketData && (
            <li className="flex gap-3">
              <span className="text-primary font-bold text-lg">•</span>
              <div>
                <strong className="text-foreground">Market Opportunity:</strong>
                <p className="text-muted-foreground mt-1">
                  Review the Market Insights section for detailed analysis of market size, growth trends, and
                  competitive landscape.
                </p>
              </div>
            </li>
          )}
          {hasClinicalData && (
            <li className="flex gap-3">
              <span className="text-primary font-bold text-lg">•</span>
              <div>
                <strong className="text-foreground">Clinical Landscape:</strong>
                <p className="text-muted-foreground mt-1">
                  Examine the Clinical Trials section to identify research gaps, active trial phases, and potential
                  white spaces.
                </p>
              </div>
            </li>
          )}
          {hasPatentData && (
            <li className="flex gap-3">
              <span className="text-primary font-bold text-lg">•</span>
              <div>
                <strong className="text-foreground">IP Strategy:</strong>
                <p className="text-muted-foreground mt-1">
                  The Patent Landscape section reveals key patent holders, expiration timelines, and potential freedom
                  to operate opportunities.
                </p>
              </div>
            </li>
          )}
          {hasTradeData && (
            <li className="flex gap-3">
              <span className="text-primary font-bold text-lg">•</span>
              <div>
                <strong className="text-foreground">Market Access:</strong>
                <p className="text-muted-foreground mt-1">
                  EXIM trends indicate import/export dynamics and potential geographic market entry points.
                </p>
              </div>
            </li>
          )}
          <li className="flex gap-3">
            <span className="text-primary font-bold text-lg">•</span>
            <div>
              <strong className="text-foreground">Next Steps:</strong>
              <p className="text-muted-foreground mt-1">
                Review all sections for comprehensive insights. Download the PDF report for detailed analysis and
                strategic recommendations.
              </p>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}
