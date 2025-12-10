"use client"

import type React from "react"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Header from "@/components/header"
import { Particles } from "@/components/ui/particles"
import { Github, Chrome } from "lucide-react"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError(result.error)
            } else if (result?.ok) {
                window.location.href = "/"
            }
        } catch (err: any) {
            console.error("Auth error", err)
            setError("An error occurred during sign in")
        } finally {
            setIsLoading(false)
        }
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
                        <h1 className="text-4xl font-bold mb-6 tracking-tight">MoleculeInsight</h1>
                        <p className="text-xl text-muted-foreground max-w-md leading-relaxed">
                            Accelerate your drug discovery pipeline with agentic AI intelligence. Unlock opportunities in minutes.
                        </p>
                    </div>
                </div>

                {/* Right side - Login form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 bg-background">
                    <div className="w-full max-w-md space-y-8">
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl font-bold text-foreground tracking-tight">Sign In</h2>
                            <p className="mt-2 text-muted-foreground">Welcome back to MoleculeInsight. Access your dashboard.</p>
                        </div>

                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSignIn} className="space-y-5">
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
                                    className="h-11 bg-muted/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="text-sm font-medium text-foreground">
                                        Password
                                    </label>
                                    <a href="#" className="text-sm text-primary hover:underline font-medium">
                                        Forgot Password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-11 bg-muted/50"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 text-base font-semibold shadow-md"
                            >
                                {isLoading ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="px-2 bg-background text-muted-foreground font-medium">Or continue with</span>
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

                        <p className="text-center text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link href="/sign-up" className="text-primary hover:underline font-medium">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
