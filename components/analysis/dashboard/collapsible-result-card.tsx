"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"
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
                "transition-all duration-300 relative overflow-hidden",
                !isOpen && "cursor-pointer hover:scale-[1.01] hover:shadow-md h-[250px]",
                isOpen && "h-full",
                className
            )}
            onClick={!isOpen ? toggleOpen : undefined}
        >
            <CardHeader
                className={cn(
                    "flex flex-row items-center justify-between space-y-0 pb-2 border-b transition-colors",
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

            <CardContent className="p-0">
                {!isOpen ? (
                    <div className="flex flex-col items-center justify-center p-6 h-[200px] animate-in fade-in duration-500">
                        <div className="relative w-32 h-32 opacity-90 transition-transform duration-300 hover:scale-105">
                            <Image
                                src="/MoleculeInsight-logo.png"
                                alt="Molecule Insight"
                                fill
                                className="object-contain drop-shadow-sm"
                                priority
                            />
                        </div>
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
