"use client"

import { useEffect, useRef } from "react"

interface MoleculeViewer3DProps {
    sdfData: string
    width?: string
    height?: string
    backgroundColor?: string
}

export default function MoleculeViewer3D({
    sdfData,
    width = "100%",
    height = "400px",
    backgroundColor = "white"
}: MoleculeViewer3DProps) {
    const viewerRef = useRef<HTMLDivElement>(null)
    const viewerInstanceRef = useRef<any>(null)

    useEffect(() => {
        // Dynamically import 3Dmol only on client side
        const load3DMol = async () => {
            if (typeof window === "undefined" || !viewerRef.current) return

            try {
                // Load 3Dmol.js dynamically
                const $3Dmol = await import("3dmol/build/3Dmol.js")

                // Clear any existing viewer
                if (viewerInstanceRef.current) {
                    viewerInstanceRef.current.clear()
                }

                // Create viewer
                const viewer = $3Dmol.createViewer(viewerRef.current, {
                    backgroundColor: backgroundColor,
                    antialias: true,
                })

                // Add model from SDF data
                viewer.addModel(sdfData, "sdf")

                // Set style - stick style for better visibility
                viewer.setStyle({}, {
                    stick: {
                        radius: 0.15,
                        colorscheme: "Jmol"
                    },
                    sphere: {
                        scale: 0.25,
                        colorscheme: "Jmol"
                    }
                })

                // Add surface (optional, can be toggled)
                // viewer.addSurface($3Dmol.SurfaceType.VDW, { opacity: 0.7, colorscheme: "whiteCarbon" })

                // Center and zoom
                viewer.zoomTo()
                viewer.zoom(1.2)
                viewer.render()

                // Enable rotation
                viewer.rotate(10, { x: 1, y: 1, z: 0 })
                viewer.render()

                viewerInstanceRef.current = viewer

                // Auto-rotate animation
                let angle = 0
                const rotateInterval = setInterval(() => {
                    angle += 1
                    viewer.rotate(1, { x: 0, y: 1, z: 0 })
                    viewer.render()
                }, 50)

                // Cleanup
                return () => {
                    clearInterval(rotateInterval)
                }
            } catch (error) {
                console.error("Error loading 3Dmol:", error)
            }
        }

        load3DMol()

        return () => {
            if (viewerInstanceRef.current) {
                viewerInstanceRef.current.clear()
            }
        }
    }, [sdfData, backgroundColor])

    return (
        <div
            ref={viewerRef}
            style={{
                width,
                height,
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden"
            }}
            className="border border-border shadow-lg"
        />
    )
}
