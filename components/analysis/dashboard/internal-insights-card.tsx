import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function InternalInsightsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Internal Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <ul className="space-y-2 text-sm">
          <li className="flex gap-3">
            <span className="text-primary font-bold">•</span>
            <span>Aligns with strategic priority on specialty indications from Q3 planning</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">•</span>
            <span>Existing manufacturing capability can support this therapeutic area</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">•</span>
            <span>BD team has established relationships with 3 potential partners</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">•</span>
            <span>Regulatory pathway clear based on precedent compounds in our portfolio</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">•</span>
            <span>R&D capacity available for Phase II initiation within 12 months</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}
