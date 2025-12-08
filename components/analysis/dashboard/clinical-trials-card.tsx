import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const trials = [
  { id: "NCT04521", drug: "Compound A", phase: "Phase III", sponsor: "MegaPharma Inc", status: "Recruiting" },
  { id: "NCT04612", drug: "Compound B", phase: "Phase II", sponsor: "BioTech Labs", status: "Active" },
  { id: "NCT04703", drug: "Reference Drug", phase: "Phase III", sponsor: "Incumbent Co", status: "Completed" },
  { id: "NCT04815", drug: "New Approach", phase: "Phase I", sponsor: "StartUp Bio", status: "Not Yet" },
]

export default function ClinicalTrialsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Clinical Trials</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Trial ID</TableHead>
                <TableHead className="text-xs">Drug</TableHead>
                <TableHead className="text-xs">Phase</TableHead>
                <TableHead className="text-xs">Sponsor</TableHead>
                <TableHead className="text-xs">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trials.map((trial) => (
                <TableRow key={trial.id}>
                  <TableCell className="text-xs font-mono">{trial.id}</TableCell>
                  <TableCell className="text-xs">{trial.drug}</TableCell>
                  <TableCell className="text-xs">{trial.phase}</TableCell>
                  <TableCell className="text-xs">{trial.sponsor}</TableCell>
                  <TableCell className="text-xs">{trial.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
