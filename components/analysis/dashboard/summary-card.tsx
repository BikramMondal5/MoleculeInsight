import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SummaryCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Executive Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground leading-relaxed">
          Current treatments for this indication have significant limitations, leaving unmet needs in patient adherence
          and efficacy. The market opportunity is substantial with a projected 8.5% CAGR, and there is clear potential
          for a novel therapeutic approach targeting this patient population.
        </p>
        <ul className="space-y-2 text-sm">
          <li className="flex gap-3">
            <span className="text-primary font-bold">•</span>
            <span>
              <strong>Unmet Need:</strong> Limited efficacy in treatment-resistant populations
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">•</span>
            <span>
              <strong>Market Gap:</strong> No dominant player with &gt;25% market share
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">•</span>
            <span>
              <strong>Opportunity:</strong> $2.3B addressable market by 2028
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">•</span>
            <span>
              <strong>Timeline:</strong> First-mover advantage window 18-24 months
            </span>
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}
