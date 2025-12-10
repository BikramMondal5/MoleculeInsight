"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/header"

export default function LoginPage() {
    const searchParams = useSearchParams()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return {
            isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
            message: password.length < minLength
                ? "Password must be at least 8 characters"
                : !hasUpperCase || !hasLowerCase
                    ? "Password must contain uppercase and lowercase letters"
                    : !hasNumbers
                        ? "Password must contain at least one number"
                        : !hasSpecialChar
                            ? "Password must contain at least one special character"
                            : ""
        };
    };

    useEffect(() => {
        const errorParam = searchParams.get('error')
        if (errorParam === 'no_account') {
            setError("No account exists with this Google account. Please sign up first.")
        } else if (errorParam === 'local_account_exists') {
            setError("An account already exists with this email. Please sign in manually with your password.")
        } else if (errorParam === 'use_local_signin') {
            setError("This account was registered manually. Please sign in with your email and password.")
        } else if (errorParam === 'account_exists') {
            setError("An account already exists with this Google account. Please sign in.")
        } else if (errorParam === 'oauth_failed') {
            setError("Unable to sign in with Google. Please try again.")
        }
    }, [searchParams])

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        // Validate email
        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            setIsLoading(false);
            return;
        }

        // Validate password (optional for login, but good practice)
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            setError(passwordValidation.message);
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Sign in failed")
            }

            window.location.href = "/"
        } catch (err: any) {
            console.error("Auth error", err)
            setError(err.message || "An error occurred during sign in")
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleLogin = () => {
        window.location.href = "/api/auth/google?signup=false"
    }

    return (
        <>
            <Header />
            <div className="flex min-h-screen pt-16 bg-background">
                {/* Left side - Visuals */}
                <div className="relative hidden lg:flex w-1/2 overflow-hidden border-r border-border">
                    <Image
                        src="/login-page-banner.jpeg"
                        alt="Login banner"
                        fill
                        className="object-cover"
                        priority
                    />
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

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full h-11 gap-2 bg-muted/30 hover:bg-muted hover:text-foreground border-border/50"
                            onClick={handleGoogleLogin}
                        >
                            <Image src="/google-logo.png" alt="Google" width={20} height={20} />
                            Google
                        </Button>

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