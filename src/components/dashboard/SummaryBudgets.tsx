"use client";

import { useEffect, useState } from "react";
import { getBudgets } from "@/actions/budgets";
import { Loader2 } from "lucide-react";

export const SummaryBudgets = ({ onSeeAll }: { onSeeAll: () => void }) => {
    const [budgets, setBudgets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getBudgets();
                setBudgets(data.slice(0, 2));
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
        <div className="space-y-4">
            {budgets.length > 0 ? (
                budgets.map((budget) => {
                    const used = 0;
                    const percentage = Math.min((used / budget.amount) * 100, 100);
                    return (
                        <div key={budget.id} className="space-y-2">
                            <div className="flex justify-between text-[11px]">
                                <span className="font-medium">{budget.category}</span>
                                <span className="text-[var(--color-text-secondary)]">{formatCurrency(budget.amount)}</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${percentage > 80 ? 'bg-red-500' : 'bg-[var(--color-accent)]'}`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="text-center py-4 bg-white/3 rounded-lg border border-dashed border-white/10">
                    <p className="text-[10px] text-[var(--color-text-muted)]">No budgets yet.</p>
                </div>
            )}
        </div>
    );
};
