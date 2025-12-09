"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue } from "framer-motion"

export function MouseFollower() {
    const cursorX = useMotionValue(-100)
    const cursorY = useMotionValue(-100)

    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX)
            cursorY.set(e.clientY)
            if (!isVisible) setIsVisible(true)
        }

        window.addEventListener("mousemove", moveCursor)
        return () => {
            window.removeEventListener("mousemove", moveCursor)
        }
    }, [cursorX, cursorY, isVisible])

    if (!isVisible) return null

    return (
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-screen"
            style={{
                translateX: cursorX,
                translateY: cursorY,
                x: "-50%",
                y: "-50%",
            }}
        >
            {/* Glossy/Shiny Glow Effect */}
            <div className="absolute inset-0 bg-primary/40 rounded-full blur-xl" />
            <div className="absolute inset-2 bg-primary/60 rounded-full blur-md" />

            {/* Outer subtle glow matching the user's requested effect */}
            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl" />
        </motion.div>
    )
}
