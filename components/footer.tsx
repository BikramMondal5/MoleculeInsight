"use client"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card/30 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center text-muted-foreground text-sm">
          <p>© {currentYear} Molecule Innovation Scout. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
