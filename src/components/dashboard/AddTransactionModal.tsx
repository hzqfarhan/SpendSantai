"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useFinanceStore } from "@/store/useFinanceStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { X, Tag, Calendar, FileText, Wallet, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { addTransaction } from "@/actions/transactions";
import { TransactionType } from "@prisma/client";

import { getAccounts } from "@/actions/accounts";

export const AddTransactionModal = () => {
    const { isAddModalOpen, setIsAddModalOpen } = useFinanceStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [accounts, setAccounts] = useState<any[]>([]);

    useEffect(() => {
        if (isAddModalOpen) {
            const fetchAccounts = async () => {
                try {
                    const data = await getAccounts();
                    setAccounts(data);
                } catch (err) {
                    console.error("Failed to fetch accounts:", err);
                }
            };
            fetchAccounts();
        }
    }, [isAddModalOpen]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const amount = parseFloat(formData.get("amount") as string);
        const type = formData.get("type") as TransactionType;
        const category = formData.get("category") as string;
        const date = new Date(formData.get("date") as string);
        const description = formData.get("description") as string;
        const account_id = formData.get("account_id") as string;

        try {
            const result = await addTransaction({
                amount,
                type,
                category,
                date,
                description,
                account_id,
            });

            if ((result as any).error) {
                setError((result as any).error);
            } else {
                setIsAddModalOpen(false);
                (e.target as HTMLFormElement).reset();
                window.location.reload();
            }
        } catch (err: any) {
            setError("A system error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsAddModalOpen(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative w-full max-w-lg z-10"
                    >
                        <GlassCard className="p-8 glow-accent">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="text-xl font-bold">
                                        Add Transaction
                                    </h3>
                                    <p className="text-[var(--color-text-secondary)] text-sm">Record a new expense or income</p>
                                </div>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                                >
                                    <X className="w-5 h-5 text-[var(--color-text-secondary)] group-hover:text-white" />
                                </button>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider ml-1 text-[var(--color-text-secondary)]">
                                        Amount (RM)
                                    </label>
                                    <div className="relative group">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-sm text-[var(--color-accent-light)]">
                                            RM
                                        </span>
                                        <input
                                            name="amount"
                                            type="number"
                                            required
                                            placeholder="0.00"
                                            className="glass-input !pl-12 !text-xl !font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider ml-1 text-[var(--color-text-secondary)]">
                                            Type
                                        </label>
                                        <select
                                            name="type"
                                            required
                                            className="glass-input cursor-pointer"
                                        >
                                            <option value="EXPENSE">Expense</option>
                                            <option value="INCOME">Income</option>
                                            <option value="TRANSFER">Transfer</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider ml-1 text-[var(--color-text-secondary)]">
                                            Method / Account
                                        </label>
                                        <div className="relative group">
                                            <Wallet className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] w-4 h-4 group-focus-within:text-[var(--color-accent-light)]" />
                                            <select
                                                name="account_id"
                                                className="glass-input !pl-10 cursor-pointer appearance-none"
                                            >
                                                <option value="">Select Account (optional)</option>
                                                {accounts.map((acc) => (
                                                    <option key={acc.id} value={acc.id}>
                                                        {acc.name} ({acc.type})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider ml-1 text-[var(--color-text-secondary)]">
                                            Category
                                        </label>
                                        <div className="relative group">
                                            <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] w-4 h-4 group-focus-within:text-[var(--color-accent-light)]" />
                                            <input
                                                name="category"
                                                type="text"
                                                required
                                                placeholder="e.g. Food, PTPTN loan"
                                                className="glass-input !pl-10"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider ml-1 text-[var(--color-text-secondary)]">
                                            Date
                                        </label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] w-4 h-4 group-focus-within:text-[var(--color-accent-light)]" />
                                            <input
                                                name="date"
                                                type="date"
                                                required
                                                defaultValue={new Date().toISOString().split('T')[0]}
                                                className="glass-input !pl-10"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider ml-1 text-[var(--color-text-secondary)]">
                                        Description
                                    </label>
                                    <div className="relative group">
                                        <FileText className="absolute left-3.5 top-4 text-[var(--color-text-muted)] w-4 h-4 group-focus-within:text-[var(--color-accent-light)]" />
                                        <textarea
                                            name="description"
                                            placeholder="Optional notes..."
                                            rows={2}
                                            className="glass-input !pl-10 resize-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={loading}
                                    className="w-full btn-primary !py-4 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        "Save Transaction"
                                    )}
                                </button>
                            </form>
                        </GlassCard>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
