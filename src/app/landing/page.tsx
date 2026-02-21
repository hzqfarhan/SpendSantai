"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowRight,
    ShieldCheck,
    Zap,
    BarChart3,
    Globe,
    Lock,
    CheckCircle2,
    PieChart,
    LineChart,
    Wallet,
    Sparkles,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const FloatingIcon = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
    <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
    >
        {children}
    </motion.div>
);

export default function LandingPage() {
    return (
        <div className="min-h-screen text-[var(--color-text-primary)] selection:bg-[var(--color-accent)]/20 overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-5">
                <div className="max-w-7xl mx-auto glass-card px-6 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Image src="/logo.svg" alt="SpendSantai" width={32} height={32} />
                        <span className="text-lg font-bold tracking-tight">SpendSantai</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--color-text-secondary)]">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#performance" className="hover:text-white transition-colors">Performance</a>
                        <a href="#security" className="hover:text-white transition-colors">Security</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-white transition-colors">
                            Sign In
                        </Link>
                        <Link href="/register" className="btn-primary text-sm !py-2.5 !px-5">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-44 pb-24 px-8 overflow-hidden">
                <div className="max-w-5xl mx-auto text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card !rounded-full text-[var(--color-accent-light)] text-xs font-bold uppercase tracking-wider"
                    >
                        <Sparkles className="w-3 h-3" /> Premium Edition 2026
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]"
                    >
                        One Ecosystem for <br />
                        <span className="gradient-text">Complete Financial</span> Control.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed"
                    >
                        SpendSantai is more than just an expense tracker. It&apos;s a smart financial
                        infrastructure that synchronizes your assets, budgets, and savings goals
                        in one elegant interface.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                    >
                        <Link href="/register" className="group btn-primary flex items-center gap-3 text-base">
                            Try Free Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="#performance" className="btn-secondary text-base">
                            View Performance Data
                        </Link>
                    </motion.div>
                </div>

                {/* Hero Cards */}
                <div className="mt-24 max-w-7xl mx-auto relative px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none pointer-events-none">
                        <FloatingIcon delay={0}>
                            <GlassCard className="p-8 glow-accent">
                                <Wallet className="w-8 h-8 mb-4 text-[var(--color-accent-light)]" />
                                <h3 className="font-bold text-[var(--color-text-primary)]">Total Assets</h3>
                                <p className="text-2xl font-black mt-2 gradient-text">RM 128,450.00</p>
                            </GlassCard>
                        </FloatingIcon>
                        <FloatingIcon delay={0.5}>
                            <GlassCard className="p-8 -translate-y-8">
                                <LineChart className="w-8 h-8 mb-4 text-emerald-400" />
                                <h3 className="font-bold text-[var(--color-text-primary)]">Growth</h3>
                                <p className="text-2xl font-black mt-2 text-emerald-400">+12.4% / month</p>
                            </GlassCard>
                        </FloatingIcon>
                        <FloatingIcon delay={1}>
                            <GlassCard className="p-8">
                                <PieChart className="w-8 h-8 mb-4 text-[var(--color-text-secondary)]" />
                                <h3 className="font-bold text-[var(--color-text-primary)]">Budget Remaining</h3>
                                <p className="text-2xl font-black mt-2 text-[var(--color-text-primary)]">RM 4,200.00</p>
                            </GlassCard>
                        </FloatingIcon>
                    </div>
                </div>
            </section>

            {/* Performance Section */}
            <section id="performance" className="py-32 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-sm font-bold text-[var(--color-accent-light)] uppercase tracking-[0.3em]">Performance & Reliability</h2>
                                <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Real-Time Data, No Compromises.</h3>
                            </div>
                            <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">
                                Our infrastructure is built on global serverless technology that guarantees
                                transaction access speeds in milliseconds. Data syncs instantly across all
                                your devices.
                            </p>
                            <div className="grid grid-cols-2 gap-6">
                                <GlassCard className="p-6 text-center">
                                    <p className="text-4xl font-black gradient-text mb-1">99.99%</p>
                                    <p className="text-xs text-[var(--color-text-secondary)] font-medium uppercase tracking-wider">Uptime Global</p>
                                </GlassCard>
                                <GlassCard className="p-6 text-center">
                                    <p className="text-4xl font-black text-emerald-400 mb-1">&lt;100ms</p>
                                    <p className="text-xs text-[var(--color-text-secondary)] font-medium uppercase tracking-wider">Data Latency</p>
                                </GlassCard>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-[var(--color-accent)]/10 blur-3xl rounded-full" />
                            <GlassCard className="p-10 relative z-10 glow-accent">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Verified System</h4>
                                        <p className="text-xs text-[var(--color-text-secondary)]">Regular Security Audit 2026</p>
                                    </div>
                                </div>
                                <div className="space-y-5">
                                    {[
                                        { label: "Bank Synchronization", status: "Operational" },
                                        { label: "Encryption Security", status: "Active" },
                                        { label: "Cloud Backup", status: "Running" },
                                        { label: "Data Analytics", status: "Operational" },
                                    ].map((item) => (
                                        <div key={item.label} className="flex justify-between items-center py-2 border-b border-white/5">
                                            <span className="text-sm font-medium">{item.label}</span>
                                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase">
                                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                                {item.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32">
                <div className="max-w-7xl mx-auto px-8 text-center space-y-20">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <h2 className="text-sm font-bold text-[var(--color-accent-light)] uppercase tracking-[0.3em]">Unlimited Complexity</h2>
                        <h3 className="text-4xl md:text-6xl font-bold tracking-tight">
                            Professional Tools <br />in Your Hands.
                        </h3>
                        <p className="text-[var(--color-text-secondary)] text-lg">
                            SpendSantai combines deep analytics with absolute ease of use.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: ShieldCheck,
                                title: "End-to-End Encryption",
                                desc: "Your financial data is encrypted using military-grade AES-256 standards before being stored in the cloud.",
                            },
                            {
                                icon: BarChart3,
                                title: "Trend Analytics",
                                desc: "Our algorithms learn your spending patterns to provide automatic savings suggestions.",
                            },
                            {
                                icon: Globe,
                                title: "Multi-Device Access",
                                desc: "Manage your finances from any device with instant synchronization.",
                            },
                            {
                                icon: PieChart,
                                title: "Budget Management",
                                desc: "Smart reminder system that notifies you before your monthly budget exceeds limits.",
                            },
                            {
                                icon: Wallet,
                                title: "Multi-Wallet Sync",
                                desc: "Track balances from multiple bank accounts and e-wallets in one unified dashboard.",
                            },
                            {
                                icon: Lock,
                                title: "Biometric Login",
                                desc: "Quick and secure access using FaceID or Fingerprint for extra protection.",
                            },
                        ].map((f, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="glass-card p-8 text-left space-y-4 cursor-default"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent-light)]">
                                    <f.icon className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-bold">{f.title}</h4>
                                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-40 px-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-accent)]/5 to-transparent" />
                <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                        Ready to Take Full Control of Your <span className="gradient-text">Future</span>?
                    </h2>
                    <p className="text-[var(--color-text-secondary)] text-xl leading-relaxed max-w-2xl mx-auto">
                        Join thousands of users who have transformed from simply &quot;spending&quot; to
                        &quot;managing&quot; with SpendSantai.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/register" className="btn-primary text-lg !px-12 !py-5">
                            Start Free Registration
                        </Link>
                        <Link href="/dashboard" className="btn-secondary text-lg !px-12 !py-5">
                            Try Demo Dashboard
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-8 border-t border-white/5 text-center space-y-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Image src="/logo.svg" alt="SpendSantai" width={32} height={32} />
                    <span className="text-xl font-bold tracking-tight">SpendSantai</span>
                </div>
                <p className="text-[var(--color-text-secondary)] text-sm">
                    &copy; 2026 SpendSantai Financial Infrastructure. Built for absolute precision.
                </p>
                <div className="flex items-center justify-center gap-8 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
                </div>
            </footer>
        </div>
    );
}
