"use client"

import { GridBackground } from "@/components/ui/glowing-card"

export default function CTASection() {
    return (
        <section className="py-20 px-4 bg-background">
            <div className="max-w-4xl mx-auto">
                <GridBackground
                    title="Ready to Transform Your Research?"
                    description="Join leading researchers and organizations using MoleculeInsight to accelerate their discovery process."
                    className="w-full"
                />
            </div>
        </section>
    )
}
