"use client";

import { useEffect, useState } from "react";
import { getTransactions, deleteTransaction } from "@/actions/transactions";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import { Trash2, Loader2, ArrowUpRight, ArrowDownLeft, RefreshCcw } from "lucide-react";

export const RecentTransactions = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getTransactions();
            setTransactions(data);
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this transaction?")) return;
        try {
            await deleteTransaction(id);
            fetchData();
        } catch (error) {
            alert("Failed to delete transaction.");
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
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-[var(--color-text-secondary)]">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent-light)]" />
                <p className="text-sm">Loading transactions...</p>
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="py-12 text-center text-[var(--color-text-secondary)] text-sm italic">
                No transactions yet.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {transactions.map((tx) => (
                <div
                    key={tx.id}
                    className="group flex items-center justify-between p-4 glass-card hover:glow-accent transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === "INCOME" ? "bg-emerald-500/10 text-emerald-400" :
                            tx.type === "TRANSFER" ? "bg-blue-500/10 text-blue-400" : "bg-red-500/10 text-red-400"
                            }`}>
                            {tx.type === "INCOME" ? <ArrowDownLeft className="w-5 h-5" /> :
                                tx.type === "TRANSFER" ? <RefreshCcw className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                        </div>
                        <div>
                            <p className="text-sm font-semibold">{tx.category}</p>
                            <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider font-bold">
                                {format(new Date(tx.date), "dd MMM yyyy", { locale: enGB })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <p className={`text-sm font-bold ${tx.type === "INCOME" ? "text-emerald-400" : "text-[var(--color-text-primary)]"}`}>
                            {tx.type === "INCOME" ? "+" : "-"} {formatCurrency(tx.amount)}
                        </p>
                        <button
                            onClick={() => handleDelete(tx.id)}
                            className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-[var(--color-text-muted)] hover:text-red-400 rounded-lg transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};
