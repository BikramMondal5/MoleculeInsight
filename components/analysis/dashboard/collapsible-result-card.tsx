"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, BarChart3 } from "lucide-react"
import { PixelCanvas } from "@/components/ui/pixel-canvas"
import { cn } from "@/lib/utils"
import Image from "next/image"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import jsPDF from "jspdf"
import TextVisualizer from "@/components/analysis/text-visualizer"

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
    const [isVisualizerOpen, setIsVisualizerOpen] = useState(false)

    const toggleOpen = () => {
        setIsOpen(!isOpen)
    }

    const handleVisualize = () => {
        setIsVisualizerOpen(true)
    }

    const getTextContent = (): string => {
        // Extract text from children
        const extractText = (node: React.ReactNode): string => {
            if (typeof node === 'string') return node
            if (typeof node === 'number') return String(node)
            if (Array.isArray(node)) return node.map(extractText).join('\n')
            if (node && typeof node === 'object' && 'props' in node) {
                return extractText((node as any).props.children)
            }
            return ''
        }
        return extractText(children)
    }

    const handleExportPDF = () => {
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        })

        // Add title
        pdf.setFontSize(18)
        pdf.setFont('helvetica', 'bold')
        pdf.text(title, 20, 20)

        // Extract text content from children
        const contentElement = document.createElement('div')
        contentElement.innerHTML = typeof children === 'string' ? children : ''

        // If children is a React element, get text content from the modal
        const modalContent = document.querySelector('[data-slot="dialog-content"]')
        const textContent = modalContent?.textContent || contentElement.textContent || ''

        // Split text into lines that fit the page width
        pdf.setFontSize(11)
        pdf.setFont('helvetica', 'normal')

        const pageWidth = pdf.internal.pageSize.getWidth()
        const margins = 20
        const maxLineWidth = pageWidth - (margins * 2)

        const lines = pdf.splitTextToSize(textContent.replace(title, '').trim(), maxLineWidth)

        let yPosition = 35
        const lineHeight = 7
        const pageHeight = pdf.internal.pageSize.getHeight()

        lines.forEach((line: string) => {
            if (yPosition + lineHeight > pageHeight - 20) {
                pdf.addPage()
                yPosition = 20
            }
            pdf.text(line, margins, yPosition)
            yPosition += lineHeight
        })

        // Download PDF
        const fileName = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`
        pdf.save(fileName)
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
                    <DialogHeader className="flex flex-row items-center justify-between space-y-0">
                        <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handleVisualize}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <BarChart3 className="w-4 h-4" />
                                Visualize
                            </Button>
                            <Button
                                onClick={handleExportPDF}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Export PDF
                            </Button>
                        </div>
                    </DialogHeader>
                    <div className="mt-4 prose prose-sm max-w-none dark:prose-invert">
                        {children}
                    </div>
                </DialogContent>
            </Dialog>

            <TextVisualizer
                isOpen={isVisualizerOpen}
                onClose={() => setIsVisualizerOpen(false)}
                title={title}
                content={getTextContent()}
            />
        </>
    )
}
