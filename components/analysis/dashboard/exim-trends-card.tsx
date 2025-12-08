import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const eximData = [
  { country: "China", imports: 2.4, exports: 0.8, trend: "↑ Growing" },
  { country: "India", imports: 1.8, exports: 0.3, trend: "↑ Growing" },
  { country: "Germany", imports: 0.9, exports: 1.2, trend: "→ Stable" },
  { country: "USA", imports: 1.1, exports: 2.1, trend: "↑ Growing" },
]

export default function EXIMTrendsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">EXIM Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Country</TableHead>
                <TableHead className="text-xs text-right">Imports ($M)</TableHead>
                <TableHead className="text-xs text-right">Exports ($M)</TableHead>
                <TableHead className="text-xs">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eximData.map((row) => (
                <TableRow key={row.country}>
                  <TableCell className="text-xs">{row.country}</TableCell>
                  <TableCell className="text-xs text-right">{row.imports}</TableCell>
                  <TableCell className="text-xs text-right">{row.exports}</TableCell>
                  <TableCell className="text-xs">{row.trend}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
