"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";
import { useFinanceStore } from "@/store/useFinanceStore";
import { useEffect, useState } from "react";
import { getDashboardStats } from "@/actions/transactions";
import { Loader2 } from "lucide-react";

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-MY", {
        style: "currency",
        currency: "MYR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

const formatCompactCurrency = (value: number) => {
    return new Intl.NumberFormat("en-MY", {
        notation: "compact",
        compactDisplay: "short",
        style: "currency",
        currency: "MYR",
    }).format(value);
};

export const MainChart = () => {
    const { filterType, setFilterType } = useFinanceStore();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const stats = await getDashboardStats(filterType);
                setData(stats as any);
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [filterType]);

    return (
        <GlassCard className="h-[400px] flex flex-col p-8 overflow-hidden relative">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="font-semibold">Activity Summary</h3>
                    <p className="text-[var(--color-text-secondary)] text-xs">Income vs expenses visualization</p>
                </div>
                <div className="flex glass-card !rounded-lg !p-1">
                    {(["week", "month", "year"] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${filterType === type
                                ? "bg-[var(--color-accent)] text-white shadow-sm"
                                : "text-[var(--color-text-secondary)] hover:text-white"
                                }`}
                        >
                            {type === "week" ? "Weekly" : type === "month" ? "Monthly" : "Yearly"}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 w-full min-h-0">
                {loading ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent-light)]" />
                    </div>
                ) : data.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center text-[var(--color-text-secondary)] text-sm italic">
                        No transaction data for this period.
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(255,255,255,0.05)"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="name"
                                stroke="rgba(240,240,245,0.35)"
                                fontSize={11}
                                fontWeight={500}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="rgba(240,240,245,0.35)"
                                fontSize={11}
                                fontWeight={500}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => formatCompactCurrency(value)}
                            />
                            <Tooltip
                                cursor={{ fill: "rgba(255,255,255,0.03)" }}
                                contentStyle={{
                                    backgroundColor: "rgba(15,15,26,0.95)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "12px",
                                    boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                                    fontSize: "12px",
                                    color: "#f0f0f5",
                                    backdropFilter: "blur(12px)",
                                }}
                                formatter={(value: any, name: any) => [
                                    formatCurrency(Number(value) || 0),
                                    String(name) === "income" ? "Income" : "Expense",
                                ]}
                            />
                            <Legend
                                verticalAlign="top"
                                align="right"
                                iconType="circle"
                                wrapperStyle={{ paddingBottom: "20px", fontSize: "12px" }}
                                formatter={(value) => (value === "income" ? "Income" : "Expense")}
                            />
                            <Bar
                                dataKey="income"
                                name="income"
                                fill="#6366f1"
                                radius={[4, 4, 0, 0]}
                                barSize={20}
                            />
                            <Bar
                                dataKey="expense"
                                name="expense"
                                fill="#f87171"
                                radius={[4, 4, 0, 0]}
                                barSize={20}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </GlassCard>
    );
};
