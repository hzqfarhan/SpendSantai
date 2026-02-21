"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail, Lock, User as UserIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/actions/register";

interface AuthCardProps {
    type: "login" | "register";
}

export const AuthCard = ({ type }: AuthCardProps) => {
    const isLogin = type === "login";
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (isLogin) {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
                setLoading(false);
            } else {
                // Force full page refresh to pick up the new session
                window.location.href = "/dashboard";
            }
        } else {
            const result = await registerUser(formData);
            if (result.error) {
                setError(result.error === "User already exists" ? "Email is already registered" : "Something went wrong");
                setLoading(false);
            } else {
                await signIn("credentials", {
                    email,
                    password,
                    callbackUrl: "/dashboard",
                });
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md z-10"
        >
            <div className="text-center mb-10">
                <div className="mx-auto mb-6">
                    <Image src="/logo.svg" alt="SpendSantai" width={48} height={48} className="mx-auto" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
                    {isLogin ? "Welcome back" : "Create a new account"}
                </h1>
                <p className="text-[var(--color-text-secondary)] mt-2">
                    {isLogin
                        ? "Enter your details to sign in to your dashboard."
                        : "Fill in your details to start tracking your finances."}
                </p>
            </div>

            <GlassCard className="p-10 glow-accent">
                {/* Social Login Buttons */}
                <div className="space-y-3 mb-6">
                    <button
                        type="button"
                        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                        className="btn-social"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    <button
                        type="button"
                        onClick={() => signIn("apple", { callbackUrl: "/dashboard" })}
                        className="btn-social"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                        </svg>
                        Continue with Apple
                    </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">or continue with email</span>
                    <div className="flex-1 h-px bg-white/10" />
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {!isLogin && (
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider ml-1">
                                Full Name
                            </label>
                            <div className="relative group">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-accent-light)] transition-colors" />
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="Alex Tan"
                                    className="glass-input !pl-11"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider ml-1">
                            Email Address
                        </label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-accent-light)] transition-colors" />
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="you@example.com"
                                className="glass-input !pl-11"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider ml-1">
                            Password
                        </label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-accent-light)] transition-colors" />
                            <input
                                name="password"
                                type="password"
                                required
                                placeholder="••••••••"
                                className="glass-input !pl-11"
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full btn-primary !py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                {isLogin ? "Sign In" : "Create Account"} <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-white/5">
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        {isLogin ? "Don't have an account yet?" : "Already have an account?"}{" "}
                        <Link
                            href={isLogin ? "/register" : "/login"}
                            className="text-[var(--color-accent-light)] font-semibold hover:underline transition-all ml-1"
                        >
                            {isLogin ? "Sign up now" : "Sign in here"}
                        </Link>
                    </p>
                </div>
            </GlassCard>
        </motion.div>
    );
};
