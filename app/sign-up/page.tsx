"use client"

import type React from "react"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import Header from "@/components/header"
import { Particles } from "@/components/ui/particles"
import { Github, Chrome } from "lucide-react"

export default function SignUpPage() {
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [skills, setSkills] = useState("")
    const [country, setCountry] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        // Placeholder for backend logic
        setTimeout(() => {
            setIsLoading(false)
            alert("Account created successfully! Please sign in.")
            window.location.href = "/login"
        }, 1000)
    }

    return (
        <>
            <Header />
            <div className="flex min-h-screen pt-16 bg-background">
                {/* Left side - Visuals */}
                <div className="relative hidden lg:flex w-1/2 bg-muted/10 items-center justify-center overflow-hidden border-r border-border">
                    <div className="absolute inset-0 z-0">
                        <Particles
                            className="absolute inset-0"
                            quantity={300}
                            ease={100}
                            color="var(--primary)"
                            refresh
                        />
                    </div>
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-background/50 to-background/5 z-10" />

                    {/* Content */}
                    <div className="relative z-20 flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-24 h-24 mb-8 rounded-3xl bg-gradient-to-br from-primary to-blue-600 opacity-10 animate-pulse flex items-center justify-center border border-primary/20 shadow-2xl">
                            <div className="w-12 h-12 bg-primary/20 rounded-xl" />
                        </div>
                        <h1 className="text-4xl font-bold mb-6 tracking-tight">Join MoleculeInsight</h1>
                        <p className="text-xl text-muted-foreground max-w-md leading-relaxed">
                            Start your journey in agentic drug repurposing. Create your account to access powerful analytical tools.
                        </p>
                    </div>
                </div>

                {/* Right side - Sign up form */}
                <div className="w-full lg:w-1/2 flex items-start justify-center px-8 py-8 md:p-12 bg-background overflow-y-auto h-[calc(100vh-4rem)]">
                    <div className="w-full max-w-md space-y-8">
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl font-bold text-foreground tracking-tight">Create Account</h2>
                            <p className="mt-2 text-muted-foreground">Join the future of molecule analysis</p>
                        </div>

                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSignUp} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-foreground">
                                        Full Name
                                    </label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="h-10 bg-muted/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="username" className="text-sm font-medium text-foreground">
                                        Username
                                    </label>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="johndoe"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="h-10 bg-muted/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-foreground">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-10 bg-muted/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-foreground">
                                    Password
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="h-10 bg-muted/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="company" className="text-sm font-medium text-foreground">
                                    Company / Organization
                                </label>
                                <Input
                                    id="skills" // Mapped to skills temporarily as per request structure
                                    type="text"
                                    placeholder="Pfizer, Novartis, University..."
                                    value={skills}
                                    onChange={(e) => setSkills(e.target.value)}
                                    className="h-10 bg-muted/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="country" className="text-sm font-medium text-foreground">
                                    Country
                                </label>
                                <Select value={country} onValueChange={setCountry}>
                                    <SelectTrigger className="h-10 bg-muted/50">
                                        <SelectValue placeholder="Select a country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="India">India</SelectItem>
                                        <SelectItem value="United States">United States</SelectItem>
                                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                        <SelectItem value="Canada">Canada</SelectItem>
                                        <SelectItem value="Germany">Germany</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 text-base font-semibold shadow-md mt-4"
                            >
                                {isLoading ? "Creating Account..." : "Create Account"}
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="px-2 bg-background text-muted-foreground font-medium">Or register with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="h-11 gap-2 bg-muted/30 hover:bg-muted hover:text-foreground border-border/50"
                                onClick={() => signIn("github", { callbackUrl: "/" })}
                            >
                                <Github className="w-4 h-4" />
                                GitHub
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="h-11 gap-2 bg-muted/30 hover:bg-muted hover:text-foreground border-border/50"
                                onClick={() => signIn("google", { callbackUrl: "/" })}
                            >
                                <Chrome className="w-4 h-4" />
                                Google
                            </Button>
                        </div>

                        <p className="text-center text-sm text-muted-foreground pb-8">
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary hover:underline font-medium">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
