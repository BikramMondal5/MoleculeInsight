import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function InnovationConceptCard() {
  return (
    <Card className="border-primary border-2 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-primary">Proposed Product Concept</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-3 text-sm">
          <li className="flex gap-3">
            <span className="text-primary font-bold text-lg">1</span>
            <div>
              <strong className="text-foreground">Target Indication:</strong>
              <p className="text-muted-foreground mt-1">
                Treatment-resistant disorder with significant unmet needs, affecting ~50K patients annually in major
                markets
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold text-lg">2</span>
            <div>
              <strong className="text-foreground">Patient Group & Dosage Form:</strong>
              <p className="text-muted-foreground mt-1">
                Adult patients (18-65) with oral formulation for convenient self-administration; potential combination
                therapy consideration
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold text-lg">3</span>
            <div>
              <strong className="text-foreground">Strategic Rationale:</strong>
              <p className="text-muted-foreground mt-1">
                Differentiated mechanism vs. incumbents; aligns with corporate strategy; enables platform expansion;
                strong IP position with first-mover advantage
              </p>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}
