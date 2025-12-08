"use client"

import Link from "next/link"
import { Beaker } from "lucide-react"

export default function Header() {
  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 bg-primary rounded-lg group-hover:bg-primary/90 transition-colors">
            <Beaker className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">Molecule Innovation Scout</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            How it works
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Demo
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Login
          </Link>
        </nav>
      </div>
    </header>
  )
}
