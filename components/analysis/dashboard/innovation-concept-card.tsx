import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, AlertCircle, Loader2 } from "lucide-react"

interface InnovationConceptCardProps {
  data?: { 
    success: boolean
    report?: string
    error?: string 
  }
  molecule: string
}

export default function InnovationConceptCard({ data, molecule }: InnovationConceptCardProps) {
   console.log("[InnovationConceptCard] Received data:", data)
  console.log("[InnovationConceptCard] Data type:", typeof data)
  console.log("[InnovationConceptCard] Data success:", data?.success)
  console.log("[InnovationConceptCard] Data report:", data?.report)
  // Loading state
  if (!data) {
    return (
      <Card className="border-primary border-2 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-primary flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating Innovation Opportunities...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Analyzing all data sources to identify strategic opportunities...
          </p>
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (!data.success || !data.report) {
    return (
      <Card className="border-primary border-2 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-primary">Innovation Opportunities for {molecule}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="w-4 h-4" />
            <span>{data.error || "Unable to generate opportunities at this time"}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Parse the JSON report
  let opportunities: Array<{ title: string; description: string }> = []
  try {
    opportunities = JSON.parse(data.report)
  } catch (e) {
    console.error("Failed to parse innovation opportunities:", e)
    return (
      <Card className="border-primary border-2 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-primary">Innovation Opportunities for {molecule}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="w-4 h-4" />
            <span>Error parsing opportunities data</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary border-2 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-primary flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Innovation Opportunities for {molecule}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground leading-relaxed">
          Based on comprehensive analysis across market insights, clinical trials, patents, trade data, and web intelligence:
        </p>
        <ul className="space-y-4 text-sm">
          {opportunities.map((opportunity, index) => (
            <li key={index} className="flex gap-3">
              <span className="text-primary font-bold text-lg mt-0.5">•</span>
              <div>
                <strong className="text-foreground">{opportunity.title}</strong>
                <p className="text-muted-foreground mt-1 leading-relaxed">
                  {opportunity.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}