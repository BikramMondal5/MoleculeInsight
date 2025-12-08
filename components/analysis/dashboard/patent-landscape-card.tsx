import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const patents = [
  { number: "US10,123,456", inventor: "MegaPharma", expiry: "2026", fto: "Blocking" },
  { number: "US10,234,567", inventor: "Incumbent Co", expiry: "2024", fto: "Expired" },
  { number: "US10,345,678", inventor: "Patent Troll Inc", expiry: "2027", fto: "Risky" },
  { number: "US10,456,789", inventor: "BioTech Labs", expiry: "2028", fto: "Clear" },
]

export default function PatentLandscapeCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Patent Landscape</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Patent</TableHead>
                <TableHead className="text-xs">Owner</TableHead>
                <TableHead className="text-xs">Expiry</TableHead>
                <TableHead className="text-xs">FTO Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patents.map((patent) => (
                <TableRow key={patent.number}>
                  <TableCell className="text-xs font-mono">{patent.number}</TableCell>
                  <TableCell className="text-xs">{patent.inventor}</TableCell>
                  <TableCell className="text-xs">{patent.expiry}</TableCell>
                  <TableCell className="text-xs">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        patent.fto === "Clear"
                          ? "bg-green-100 text-green-800"
                          : patent.fto === "Expired"
                            ? "bg-blue-100 text-blue-800"
                            : patent.fto === "Risky"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {patent.fto}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
