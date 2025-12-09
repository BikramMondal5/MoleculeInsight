"use client"

import Link from "next/link"
import Image from "next/image"
import { Beaker } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function Header() {
  return (
    <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50 shadow-sm dark:shadow-primary/5">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8 overflow-hidden rounded-lg">
            <Image
              src="/MoleculeInsight-logo.png"
              alt="MoleculeInsight Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-lg font-semibold text-foreground">MoleculeInsight</span>
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How it works
            </Link>
            <Link href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </Link>
            <Link href="/analysis" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Analyse
            </Link>
          </nav>

          <ThemeToggle className="ml-2" />
        </div>
      </div>
    </header>
  )
}
