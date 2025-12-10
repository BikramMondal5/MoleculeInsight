"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"

// Simple ThemeToggle component
function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState("light")
  
  useEffect(() => {
    const root = document.documentElement
    const currentTheme = root.classList.contains("dark") ? "dark" : "light"
    setTheme(currentTheme)
  }, [])
  
  const toggleTheme = () => {
    const root = document.documentElement
    const newTheme = theme === "light" ? "dark" : "light"
    root.classList.toggle("dark")
    setTheme(newTheme)
  }
  
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg hover:bg-accent ${className}`}
      aria-label="Toggle theme"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  )
}

export default function Header() {
  const pathname = usePathname()
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Check if we're on auth pages
  const isAuthPage = pathname === '/login' || pathname === '/sign-up'

  useEffect(() => {
    // Check if user is logged in
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user)
        }
      })
      .catch(err => console.error('Failed to fetch user:', err))
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        setUser(null)
        window.location.href = '/login'
      } else {
        alert('Logout failed. Please try again.')
      }
    } catch (error) {
      console.error('Logout error:', error)
      alert('An error occurred during logout.')
    } finally {
      setIsLoggingOut(false)
      setShowLogoutConfirm(false)
    }
  }

  return (
    <>
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50 shadow-sm dark:shadow-primary/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
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

            {user && !isAuthPage && (
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>Welcome, <span className="font-medium text-foreground">{user.name}</span></span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            {/* Only show navigation links if NOT on auth pages */}
            {!isAuthPage && (
              <nav className="hidden md:flex items-center gap-8">
                {user && (
                  <>
                    <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      How it works
                    </Link>
                    <Link href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Testimonials
                    </Link>
                    <Link href="/analysis" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Analyse
                    </Link>
                  </>
                )}
              </nav>
            )}

            <ThemeToggle className="ml-2" />

            {/* Only show auth buttons if NOT on auth pages */}
            {!isAuthPage && (
              <>
                {!user ? (
                  <div className="flex items-center gap-3">
                    <Link href="/login">
                      <Button variant="ghost" size="sm">Login</Button>
                    </Link>
                    <Link href="/sign-up">
                      <Button size="sm">Sign Up</Button>
                    </Link>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLogoutConfirm(true)}
                    className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <LogOut className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Confirm Logout</h3>
                <p className="text-sm text-muted-foreground">Are you sure you want to log out?</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground border-l-2 border-primary/30 pl-4">
              You will need to sign in again to access your account and continue your analysis.
            </p>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowLogoutConfirm(false)}
                disabled={isLoggingOut}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 gap-2"
              >
                {isLoggingOut ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    Logout
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}