import CollapsibleResultCard from "./collapsible-result-card"
import { AlertCircle } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface ClinicalTrialsCardProps {
  data?: { success: boolean; report?: string; error?: string }
}

export default function ClinicalTrialsCard({ data }: ClinicalTrialsCardProps) {
  if (!data || !data.success) {
    return (
      <CollapsibleResultCard title="Clinical Trials">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertCircle className="w-4 h-4" />
          <span>{data?.error || "No clinical trials data available"}</span>
        </div>
      </CollapsibleResultCard>
    )
  }

  return (
    <CollapsibleResultCard title="Clinical Trials">
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <ReactMarkdown>{data.report || "No report generated"}</ReactMarkdown>
      </div>
    </CollapsibleResultCard>
  )
}
