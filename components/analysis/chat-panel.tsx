"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface Message {
  id: string
  role: "user" | "agent"
  agent?: string
  content: string
}

interface ChatPanelProps {
  messages: Message[]
  isAnalyzing: boolean
}

export default function ChatPanel({ messages, isAnalyzing }: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Analysis Progress</CardTitle>
        <CardDescription>Real-time updates from AI agents analyzing your query</CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <div className="h-96 overflow-y-auto border-b bg-card/50">
          <div className="p-6 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "agent" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                )}

                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-muted-foreground rounded-bl-none"
                  }`}
                >
                  {msg.role === "agent" && msg.agent && (
                    <div className="text-xs font-semibold mb-1 opacity-75">{msg.agent}</div>
                  )}
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}

            {isAnalyzing && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                </div>
                <div className="bg-muted text-muted-foreground px-4 py-2 rounded-lg rounded-bl-none">
                  <p className="text-sm">Analyzing...</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
