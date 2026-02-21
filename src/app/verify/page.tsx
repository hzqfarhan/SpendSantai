"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmail } from "@/actions/verify";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

function VerifyContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("No verification token provided.");
            return;
        }

        verifyEmail(token).then((result) => {
            if (result.success) {
                setStatus("success");
                setMessage(result.message || "Email verified successfully!");
            } else {
                setStatus("error");
                setMessage(result.error || "Verification failed.");
            }
        });
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
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
                        Email Verification
                    </h1>
                </div>

                <GlassCard className="p-10 glow-accent text-center">
                    {status === "loading" && (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <Loader2 className="w-12 h-12 animate-spin text-[var(--color-accent-light)]" />
                            <p className="text-[var(--color-text-secondary)] font-medium">Verifying your email...</p>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <CheckCircle className="w-10 h-10 text-emerald-400" />
                            </div>
                            <h2 className="text-xl font-bold text-emerald-400">{message}</h2>
                            <p className="text-sm text-[var(--color-text-secondary)]">You can now sign in to your account.</p>
                            <Link href="/login" className="btn-primary !py-3 !px-8 text-sm font-bold flex items-center gap-2 mt-4">
                                Sign In <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                                <XCircle className="w-10 h-10 text-red-400" />
                            </div>
                            <h2 className="text-xl font-bold text-red-400">Verification Failed</h2>
                            <p className="text-sm text-[var(--color-text-secondary)]">{message}</p>
                            <Link href="/register" className="btn-secondary !py-3 !px-8 text-sm font-bold mt-4">
                                Try Again
                            </Link>
                        </div>
                    )}
                </GlassCard>
            </motion.div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[var(--color-accent-light)]" />
            </div>
        }>
            <VerifyContent />
        </Suspense>
    );
}
