"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
    className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
    const [mounted, setMounted] = useState(false)
    const { resolvedTheme, setTheme } = useTheme()
    const isDark = resolvedTheme === "dark"

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className={cn("w-16 h-8", className)} />
        )
    }

    return (
        <div
            className={cn(
                "flex w-16 h-8 p-1 rounded-full cursor-pointer transition-all duration-300",
                isDark
                    ? "bg-zinc-900 border border-zinc-700"
                    : "bg-gray-100 border border-gray-300",
                className
            )}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setTheme(isDark ? "light" : "dark")
                }
            }}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            <div className="flex justify-between items-center w-full relative">
                <div
                    className={cn(
                        "absolute flex justify-center items-center w-6 h-6 rounded-full transition-all duration-300 ease-in-out",
                        isDark
                            ? "transform translate-x-0 bg-zinc-800 shadow-lg"
                            : "transform translate-x-8 bg-white shadow-md"
                    )}
                >
                    {isDark ? (
                        <Moon
                            className="w-3.5 h-3.5 text-blue-400"
                            strokeWidth={2}
                        />
                    ) : (
                        <Sun
                            className="w-3.5 h-3.5 text-amber-500"
                            strokeWidth={2}
                        />
                    )}
                </div>
                <div className="flex justify-between items-center w-full px-1">
                    <Sun
                        className={cn(
                            "w-3.5 h-3.5 transition-opacity duration-200",
                            isDark ? "opacity-30 text-gray-500" : "opacity-0"
                        )}
                        strokeWidth={2}
                    />
                    <Moon
                        className={cn(
                            "w-3.5 h-3.5 transition-opacity duration-200",
                            isDark ? "opacity-0" : "opacity-30 text-gray-600"
                        )}
                        strokeWidth={2}
                    />
                </div>
            </div>
        </div>
    )
}
