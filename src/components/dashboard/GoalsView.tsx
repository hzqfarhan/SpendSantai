"use client";

import { useEffect, useState } from "react";
import { getGoals, addGoal, deleteGoal, updateGoalProgress } from "@/actions/goals";
import {
    Target,
    Plus,
    Trash2,
    Loader2,
    Trophy,
    Calendar,
    ArrowRight,
    Sparkles,
    Coins
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";

export const GoalsView = () => {
    const [goals, setGoals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getGoals();
            setGoals(data);
        } catch (error) {
            console.error("Failed to fetch goals:", error);
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
            await addGoal({
                name: formData.get("name") as string,
                target_amount: parseFloat(formData.get("target_amount") as string),
                current_amount: parseFloat(formData.get("current_amount") as string) || 0,
                deadline: formData.get("deadline") ? new Date(formData.get("deadline") as string) : undefined,
            });
            setIsAdding(false);
            fetchData();
        } catch (error) {
            alert("Failed to add goal.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this goal?")) return;
        try {
            await deleteGoal(id);
            fetchData();
        } catch (error) {
            alert("Failed to delete goal.");
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
                <p className="font-medium">Loading your goals...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Saving Goals</h2>
                    <p className="text-[var(--color-text-secondary)] text-sm">Achieve your financial dreams step by step.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn-primary !py-2.5 !px-4 text-sm font-semibold flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Goal
                </button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        <GlassCard className="p-8 glow-accent">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase">What do you want to achieve?</label>
                                        <div className="relative">
                                            <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-accent-light)]" />
                                            <input name="name" required placeholder="e.g. Trip to Langkawi, New laptop" className="glass-input !pl-10" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase">How much do you need?</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--color-accent-light)]">RM</span>
                                            <input name="target_amount" type="number" required placeholder="0.00" className="glass-input !pl-10" />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase">Current amount saved</label>
                                        <div className="relative">
                                            <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                                            <input name="current_amount" type="number" defaultValue="0" className="glass-input !pl-10" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase">Target date (Optional)</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                                            <input name="deadline" type="date" className="glass-input !pl-10" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button type="submit" disabled={saving} className="flex-1 btn-primary !py-4 disabled:opacity-50">
                                        {saving ? "Processing..." : "Set Goal"}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {goals.map((goal) => {
                    const percentage = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
                    const isDone = percentage >= 100;

                    return (
                        <motion.div key={goal.id} layout>
                            <GlassCard className={`p-8 relative overflow-hidden group hover:glow-accent transition-all ${isDone ? 'border-emerald-500/20' : ''}`}>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="space-y-1">
                                        <h4 className="text-xl font-bold flex items-center gap-2">
                                            {goal.name}
                                            {isDone && <Trophy className="w-5 h-5 text-yellow-500" />}
                                        </h4>
                                        {goal.deadline && (
                                            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> Target: {format(new Date(goal.deadline), "dd MMM yyyy", { locale: enGB })}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleDelete(goal.id)}
                                        className="p-2 text-[var(--color-text-muted)] hover:text-red-400 rounded-lg"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-widest">Saved</p>
                                            <p className="text-2xl font-black tracking-tight gradient-text">{formatCurrency(goal.current_amount)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-widest">Target</p>
                                            <p className="text-sm font-semibold">{formatCurrency(goal.target_amount)}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-1">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                className={`h-full rounded-full ${isDone ? 'bg-emerald-500' : 'bg-[var(--color-accent)]'}`}
                                            />
                                        </div>
                                        <div className="flex justify-between text-[10px] font-bold text-[var(--color-text-muted)] uppercase">
                                            <span>{Math.round(percentage)}% Complete</span>
                                            <span>{formatCurrency(goal.target_amount - goal.current_amount)} to go</span>
                                        </div>
                                    </div>
                                </div>

                                {isDone && (
                                    <div className="mt-6 pt-6 border-t border-emerald-500/20 flex justify-between items-center text-emerald-400">
                                        <p className="text-xs font-bold uppercase tracking-widest">Goal Achieved!</p>
                                        <Sparkles className="w-5 h-5 animate-pulse" />
                                    </div>
                                )}
                            </GlassCard>
                        </motion.div>
                    );
                })}

                {goals.length === 0 && !isAdding && (
                    <div className="md:col-span-2 py-20 text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Target className="w-10 h-10 text-[var(--color-text-muted)] opacity-20" />
                        </div>
                        <h3 className="text-lg font-bold">No goals yet</h3>
                        <p className="text-[var(--color-text-secondary)] text-sm mt-1">Set your financial goals and start saving today.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
