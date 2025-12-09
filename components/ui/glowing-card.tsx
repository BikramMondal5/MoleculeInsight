"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface GridBackgroundProps {
    title: string
    description: string
    showAvailability?: boolean
    className?: string
}

export function GridBackground({
    title,
    description,
    showAvailability = true,
    className,
}: GridBackgroundProps) {
    return (
        <div
            className={cn(
                'px-10 py-20 rounded-md relative mx-18 flex items-center justify-center overflow-hidden',
                'bg-white dark:bg-black',
                className
            )}
            style={{
                // Using CSS variables or utility classes would be better for adaptability, 
                // but inline styles are used here to match the specific grid effect requested.
                // We will rely on the container's background color class for the base.
            }}
        >
            {/* Grid Pattern */}
            <div
                className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"
            />

            <div
                className="w-3 h-3 rounded-full absolute shadow-[0_0_15px] shadow-current z-10 bg-current"
                style={{
                    animation: `
            border-follow 6s linear infinite,
            color-change 6s linear infinite
          `
                }}
            />
            <div
                className="absolute inset-0 border-2 rounded-md"
                style={{
                    animation: 'border-color-change 6s linear infinite'
                }}
            />

            <div className="relative z-20 text-center max-w-4xl">
                <h1 className='text-4xl md:text-6xl font-bold text-gray-900 dark:text-white tracking-tight'>{title}</h1>
                {description && (
                    <p className='text-lg md:text-xl mt-5 text-gray-600 dark:text-gray-300'>{description}</p>
                )}

                {showAvailability && (
                    <div className="available-now text-[#20bb5a] text-sm flex items-center justify-center mt-8 font-medium">
                        <div className="w-2 h-2 bg-[#20bb5a] rounded-full inline-block mr-2 animate-pulse shadow-[0_0_8px_#20bb5a]" />
                        Get Started Now
                    </div>
                )}
            </div>
        </div>
    )
}
