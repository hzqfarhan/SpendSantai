"use client";

import { useEffect, useState } from "react";
import { getGoals } from "@/actions/goals";
import { Loader2 } from "lucide-react";

export const SummaryGoals = ({ onSeeAll }: { onSeeAll: () => void }) => {
    const [goals, setGoals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getGoals();
                setGoals(data.slice(0, 1));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-MY", {
            style: "currency",
            currency: "MYR",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    if (loading) return <div className="py-10 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-[var(--color-accent-light)]" /></div>;

    return (
        <div className="space-y-3">
            {goals.length > 0 ? (
                goals.map((goal) => {
                    const percentage = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
                    return (
                        <div key={goal.id} className="glass-card !rounded-xl p-4 glow-accent">
                            <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold mb-1">{goal.name}</p>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-lg font-bold italic tracking-tight gradient-text">{formatCurrency(goal.target_amount)}</p>
                                    <p className="text-[10px] text-[var(--color-text-secondary)]">Saved: {formatCurrency(goal.current_amount)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-black">{Math.round(percentage)}%</p>
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="text-center py-4 bg-white/3 rounded-lg border border-dashed border-white/10">
                    <p className="text-[10px] text-[var(--color-text-muted)]">No goals yet.</p>
                </div>
            )}
        </div>
    );
};
