"use client";

import { useEffect, useState } from "react";
import { getTransactions, deleteTransaction } from "@/actions/transactions";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import {
    Trash2,
    Loader2,
    ArrowUpRight,
    ArrowDownLeft,
    RefreshCcw,
    Search,
    Filter,
    Download
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";

export const TransactionsView = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("ALL");

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

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch = tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (tx.description && tx.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesFilter = filterType === "ALL" || tx.type === filterType;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-[var(--color-text-secondary)]">
                <Loader2 className="w-10 h-10 animate-spin text-[var(--color-accent-light)]" />
                <p className="font-medium">Loading transactions...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                    <input
                        type="text"
                        placeholder="Search by category or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="glass-input !pl-10"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex glass-card !rounded-xl !p-1">
                        {["ALL", "INCOME", "EXPENSE", "TRANSFER"].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterType === type
                                    ? "bg-[var(--color-accent)] text-white shadow-sm"
                                    : "text-[var(--color-text-secondary)] hover:text-white"
                                    }`}
                            >
                                {type === "ALL" ? "All" : type === "INCOME" ? "Income" : type === "EXPENSE" ? "Expense" : "Transfer"}
                            </button>
                        ))}
                    </div>
                    <button className="p-2.5 glass-card !rounded-xl text-[var(--color-text-secondary)] hover:text-white transition-all">
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <GlassCard className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-white/3 text-left border-b border-white/5">
                                <th className="px-6 py-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Category & Description</th>
                                <th className="px-6 py-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider text-right">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((tx) => (
                                        <motion.tr
                                            key={tx.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-white/3 transition-colors group"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="text-sm font-medium">
                                                    {format(new Date(tx.date), "dd MMM yyyy", { locale: enGB })}
                                                </p>
                                                <p className="text-[10px] text-[var(--color-text-muted)]">
                                                    {format(new Date(tx.date), "HH:mm")}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-semibold">{tx.category}</p>
                                                {tx.description && (
                                                    <p className="text-xs text-[var(--color-text-secondary)] truncate max-w-xs">{tx.description}</p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${tx.type === "INCOME" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                                    tx.type === "TRANSFER" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                                                        "bg-red-500/10 text-red-400 border border-red-500/20"
                                                    }`}>
                                                    {tx.type === "INCOME" ? <ArrowDownLeft className="w-3 h-3" /> :
                                                        tx.type === "TRANSFER" ? <RefreshCcw className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                                                    {tx.type}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <p className={`text-sm font-bold ${tx.type === "INCOME" ? "text-emerald-400" : ""}`}>
                                                    {tx.type === "INCOME" ? "+" : "-"} {formatCurrency(tx.amount)}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(tx.id)}
                                                    className="p-2 text-[var(--color-text-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-[var(--color-text-secondary)] text-sm italic">
                                            No transactions found.
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
};
