"use client"

import Link from "next/link"
import { Beaker } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AnalysisHeader() {
  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 bg-primary rounded-lg group-hover:bg-primary/90 transition-colors">
            <Beaker className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">Molecule Scout</span>
        </Link>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            Help
          </Button>
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
      </div>
    </header>
  )
}
