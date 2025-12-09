import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface InternalKnowledgeCardProps {
  data?: { success: boolean; report?: string; error?: string }
}

export default function InternalKnowledgeCard({ data }: InternalKnowledgeCardProps) {
  if (!data || !data.success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Internal Knowledge</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="w-4 h-4" />
            <span>{data?.error || "No internal knowledge data available"}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Internal Knowledge</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown>{data.report || "No report generated"}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  )
}