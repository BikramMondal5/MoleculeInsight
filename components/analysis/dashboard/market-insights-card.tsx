import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const marketData = [
  { indication: "Primary", marketSize: 890, cagr: 7.2 },
  { indication: "Secondary", marketSize: 620, cagr: 6.8 },
  { indication: "Tertiary", marketSize: 420, cagr: 5.4 },
  { indication: "Emerging", marketSize: 280, cagr: 12.1 },
]

export default function MarketInsightsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Market Insights (IQVIA)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={marketData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="indication" stroke="hsl(var(--muted-foreground))" style={{ fontSize: "12px" }} />
            <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
            <Bar dataKey="marketSize" fill="hsl(var(--primary))" name="Market Size ($M)" />
            <Bar dataKey="cagr" fill="hsl(var(--chart-2))" name="CAGR (%)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
