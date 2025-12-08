"use client";

import Header from "@/components/header"
import Hero from "@/components/hero"
import HowItWorks from "@/components/how-it-works"
import WhoIsItFor from "@/components/who-is-it-for"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <HowItWorks />
      <WhoIsItFor />
      <Footer />
    </div>
  )
}
