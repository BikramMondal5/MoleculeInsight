import { useState, useEffect, useId } from "react"
import { createPortal } from "react-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Maximize2 } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

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
    const [mounted, setMounted] = useState(false)
    const uniqueId = useId()

    useEffect(() => {
        setMounted(true)
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    const toggleOpen = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        setIsOpen(!isOpen)
    }

    return (
        <>
            <motion.div
                layoutId={`card-container-${title}-${uniqueId}`}
                onClick={toggleOpen}
                className={cn(
                    "cursor-pointer h-[250px] relative overflow-hidden transition-all duration-300 isolate",
                    className
                )}
                initial={{ borderRadius: 12 }}
            >
                {/* We use a standard Card structure but assume motion handles the layout size */}
                <Card className="h-full w-full border-0 shadow-none bg-transparent pointer-events-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
                        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                        <Maximize2 className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="p-0 h-full">
                        <div className="flex flex-col items-center justify-center p-6 h-[200px]">
                            <div className="relative w-32 h-32 opacity-90 transition-transform duration-300 group-hover:scale-105">
                                <Image
                                    src="/MoleculeInsight-logo.png"
                                    alt="Molecule Insight"
                                    fill
                                    className="object-contain drop-shadow-sm"
                                    priority
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {mounted && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div className="fixed inset-0 z-[100] isolate">
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={toggleOpen}
                                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                            />

                            {/* Expanded Card */}
                            <motion.div
                                layoutId={`card-container-${title}-${uniqueId}`}
                                className={cn(
                                    "absolute inset-0 z-[101] flex flex-col bg-background overflow-hidden",
                                    "shadow-2xl"
                                )}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                <Card className="h-full w-full flex flex-col rounded-none border-0 shadow-none">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 py-4 px-6 border-b shrink-0 bg-card">
                                        <CardTitle className="text-xl font-bold">{title}</CardTitle>
                                        <button
                                            onClick={toggleOpen}
                                            className="rounded-full bg-secondary/50 p-2 hover:bg-secondary transition-colors"
                                        >
                                            <X className="h-5 w-5" />
                                            <span className="sr-only">Close</span>
                                        </button>
                                    </CardHeader>
                                    <CardContent className="flex-1 overflow-y-auto w-full p-6 md:px-12 md:pt-4 md:pb-10">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            {children}
                                        </motion.div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    )
}
