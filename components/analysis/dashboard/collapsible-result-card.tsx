"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import { PixelCanvas } from "@/components/ui/pixel-canvas"
import { cn } from "@/lib/utils"
import Image from "next/image"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

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

    const toggleOpen = () => {
        setIsOpen(!isOpen)
    }

    return (
        <>
            <Card
                className={cn(
                    "group relative transition-all duration-300 overflow-hidden border-border cursor-pointer hover:scale-[1.02] hover:shadow-lg h-[420px] hover:border-primary/50",
                    className
                )}
                onClick={toggleOpen}
            >
                <PixelCanvas
                    gap={8}
                    speed={25}
                    colors={["#e0f2fe", "#7dd3fc", "#0ea5e9"]}
                    variant="default"
                />

                <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2 border-b">
                    <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                </CardHeader>

                <CardContent className="relative z-10 p-0">
                    <div className="flex items-center justify-center h-[370px] -mt-12 animate-in fade-in duration-500">
                        <div className="relative w-60 h-60 opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105">
                            <Image
                                src="/MoleculeInsight-logo.png"
                                alt="MoleculeInsight"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-full w-full max-h-screen h-screen overflow-y-auto sm:max-w-full rounded-none border-0 p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 prose prose-sm max-w-none dark:prose-invert">
                        {children}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
