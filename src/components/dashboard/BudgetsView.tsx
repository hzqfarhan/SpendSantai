"use client";

import { useEffect, useState } from "react";
import { getBudgets, addBudget, deleteBudget } from "@/actions/budgets";
import {
    PieChart,
    Plus,
    Trash2,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Calendar,
    ChevronRight,
    Target
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";

export const BudgetsView = () => {
    const [budgets, setBudgets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getBudgets();
            setBudgets(data);
        } catch (error) {
            console.error("Failed to fetch budgets:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        const formData = new FormData(e.currentTarget);

        try {
            await addBudget({
                category: formData.get("category") as string,
                amount: parseFloat(formData.get("amount") as string),
                period: formData.get("period") as string,
                start_date: new Date(formData.get("start_date") as string),
                end_date: new Date(formData.get("end_date") as string),
            });
            setIsAdding(false);
            fetchData();
        } catch (error) {
            alert("Failed to add budget.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this budget?")) return;
        try {
            await deleteBudget(id);
            fetchData();
        } catch (error) {
            alert("Failed to delete budget.");
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-MY", {
            style: "currency",
            currency: "MYR",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-[var(--color-text-secondary)]">
                <Loader2 className="w-10 h-10 animate-spin text-[var(--color-accent-light)]" />
                <p className="font-medium">Calculating budget allocation...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Budgets</h2>
                    <p className="text-[var(--color-text-secondary)] text-sm">Control your spending with smart budgets.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn-primary !py-2.5 !px-4 text-sm font-semibold flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Create Budget
                </button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                    >
                        <GlassCard className="p-8 glow-accent">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase ml-1">Category</label>
                                        <input name="category" required placeholder="e.g. Food & Drinks, TNB bill" className="glass-input" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase ml-1">Limit (RM)</label>
                                        <input name="amount" type="number" required placeholder="0.00" className="glass-input" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase ml-1">Period</label>
                                        <select name="period" className="glass-input cursor-pointer">
                                            <option value="MONTHLY">Monthly</option>
                                            <option value="WEEKLY">Weekly</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase ml-1">Start Date</label>
                                        <input name="start_date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="glass-input" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase ml-1">End Date</label>
                                        <input name="end_date" type="date" required className="glass-input" />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button type="submit" disabled={saving} className="flex-1 btn-primary !py-4 disabled:opacity-50">
                                        {saving ? "Saving..." : "Activate Budget"}
                                    </button>
                                    <button type="button" onClick={() => setIsAdding(false)} className="btn-secondary !py-4 !px-8">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 gap-6">
                {budgets.map((budget) => {
                    const used = 0;
                    const percentage = Math.min((used / budget.amount) * 100, 100);
                    const isOver = used > budget.amount;

                    return (
                        <motion.div key={budget.id} layout>
                            <GlassCard className="p-6 hover:glow-accent transition-all">
                                <div className="flex flex-col md:flex-row gap-6 justify-between">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent-light)]">
                                                <Target className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold">{budget.category}</h4>
                                                <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-widest">
                                                    {budget.period} • {format(new Date(budget.start_date), "dd MMM", { locale: enGB })} - {format(new Date(budget.end_date), "dd MMM yyyy", { locale: enGB })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <p className="text-xs font-bold">Usage Progress</p>
                                                <p className="text-sm font-black">{formatCurrency(used)} <span className="text-[var(--color-text-secondary)] font-normal">/ {formatCurrency(budget.amount)}</span></p>
                                            </div>
                                            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percentage}%` }}
                                                    className={`h-full rounded-full ${isOver ? 'bg-red-500' : 'bg-[var(--color-accent)]'}`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex md:flex-col justify-between items-end gap-4 min-w-[120px]">
                                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${isOver ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                                            }`}>
                                            {isOver ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                            {isOver ? "Over" : "On track"}
                                        </div>
                                        <button
                                            onClick={() => handleDelete(budget.id)}
                                            className="p-3 text-[var(--color-text-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    );
                })}

                {budgets.length === 0 && !isAdding && (
                    <div className="py-20 text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <PieChart className="w-10 h-10 text-[var(--color-text-muted)] opacity-20" />
                        </div>
                        <h3 className="text-lg font-bold">No budgets yet</h3>
                        <p className="text-[var(--color-text-secondary)] text-sm mt-1">Financial discipline starts with a clear budget.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
