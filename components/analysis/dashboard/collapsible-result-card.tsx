"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"
import { PixelCanvas } from "@/components/ui/pixel-canvas"
import { cn } from "@/lib/utils"

interface CollapsibleResultCardProps {
    title: string
    children: React.ReactNode
    defaultOpen?: boolean
    className?: string
}

export default function CollapsibleResultCard({
    title,
    children,
    defaultOpen = false,
    className,
}: CollapsibleResultCardProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    const toggleOpen = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        setIsOpen(!isOpen)
    }

    return (
        <Card
            className={cn(
                "group relative transition-all duration-300 overflow-hidden border-border",
                !isOpen && "cursor-pointer hover:scale-[1.01] hover:shadow-md h-[250px] hover:border-primary/50",
                isOpen && "h-full",
                className
            )}
            onClick={!isOpen ? toggleOpen : undefined}
        >
            {!isOpen && (
                <PixelCanvas
                    gap={8}
                    speed={25}
                    colors={["#e0f2fe", "#7dd3fc", "#0ea5e9"]}
                    variant="default"
                />
            )}

            <CardHeader
                className={cn(
                    "relative z-10 flex flex-row items-center justify-between space-y-0 pb-2 border-b transition-colors",
                    isOpen && "cursor-pointer hover:bg-muted/50"
                )}
                onClick={isOpen ? toggleOpen : undefined}
            >
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                <button
                    onClick={toggleOpen}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                    {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
            </CardHeader>

            <CardContent className="relative z-10 p-0">
                {!isOpen ? (
                    <div className="flex flex-col items-center justify-center p-6 h-[200px] animate-in fade-in duration-500">
                        <p className="text-sm text-muted-foreground text-center">
                            Click to expand and view details
                        </p>
                    </div>
                ) : (
                    <div className="p-6 pt-4 animate-in fade-in slide-in-from-top-2 duration-500">
                        {children}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
