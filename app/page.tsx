"use client";

import Header from "@/components/header"
import Hero from "@/components/hero"
import KeyFeatures from "@/components/key-features"
import HowItWorks from "@/components/how-it-works"
import TestimonialCarousel from "@/components/testimonials"
import CTASection from "@/components/cta-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <KeyFeatures />
      <HowItWorks />
      <TestimonialCarousel />
      <CTASection />
      <Footer />
    </div>
  )
}
