"use client";

import { useEffect, useState } from "react";
import { getAccounts, addAccount, deleteAccount } from "@/actions/accounts";
import {
    Wallet,
    Plus,
    Trash2,
    Loader2,
    CreditCard,
    Banknote,
    Smartphone,
    TrendingUp,
    MoreVertical
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";

export const AccountsView = () => {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getAccounts();
            setAccounts(data);
        } catch (error) {
            console.error("Failed to fetch accounts:", error);
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
            const result = await addAccount({
                name: formData.get("name") as string,
                type: formData.get("type") as string,
                balance: parseFloat(formData.get("balance") as string),
            });

            if (result.error) {
                alert(result.error);
            } else {
                setIsAdding(false);
                fetchData();
            }
        } catch (error) {
            alert("Failed to add account.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this account?")) return;
        try {
            const result = await deleteAccount(id);
            if (result.error) {
                alert(result.error);
            } else {
                fetchData();
            }
        } catch (error: any) {
            alert("Failed to delete account.");
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-MY", {
            style: "currency",
            currency: "MYR",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "BANK": return <Banknote className="w-6 h-6" />;
            case "E-WALLET": return <Smartphone className="w-6 h-6" />;
            default: return <Wallet className="w-6 h-6" />;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-[var(--color-text-secondary)]">
                <Loader2 className="w-10 h-10 animate-spin text-[var(--color-accent-light)]" />
                <p className="font-medium">Connecting to your accounts...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Accounts</h2>
                    <p className="text-[var(--color-text-secondary)] text-sm">Manage all your banks and wallets in one place.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn-primary !py-2.5 !px-4 text-sm font-semibold flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Account
                </button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <GlassCard className="p-6 border-[var(--color-accent)]/20 glow-accent">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase">Account Name</label>
                                    <input
                                        name="name"
                                        required
                                        placeholder="e.g. Maybank, TNG eWallet"
                                        className="glass-input"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase">Type</label>
                                    <select name="type" required className="glass-input cursor-pointer">
                                        <option value="BANK">Bank</option>
                                        <option value="E-WALLET">E-Wallet</option>
                                        <option value="CASH">Cash</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase">Starting Balance (RM)</label>
                                    <input
                                        name="balance"
                                        type="number"
                                        required
                                        placeholder="0.00"
                                        className="glass-input"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 btn-primary !py-2 text-sm font-bold disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Save"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsAdding(false)}
                                        className="btn-secondary !py-2 !px-4 text-sm font-bold"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map((acc) => (
                    <motion.div
                        key={acc.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="group"
                    >
                        <GlassCard className="p-6 hover:glow-accent transition-all cursor-pointer overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(acc.id); }}
                                    className="p-2 text-[var(--color-text-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${acc.type === "BANK" ? "bg-blue-500/10 text-blue-400" :
                                    acc.type === "E-WALLET" ? "bg-purple-500/10 text-purple-400" : "bg-amber-500/10 text-amber-400"
                                    }`}>
                                    {getIcon(acc.type)}
                                </div>
                                <div>
                                    <h4 className="font-bold">{acc.name}</h4>
                                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold">{acc.type}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase mb-1">Available Balance</p>
                                    <p className="text-2xl font-black tracking-tight">
                                        {formatCurrency(acc.balance)}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-[var(--color-text-muted)] font-medium">
                                    <span className="flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3 text-emerald-400" /> +0% this month
                                    </span>
                                    <span>Active</span>
                                </div>
                            </div>

                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[var(--color-accent)]/5 rounded-full blur-2xl" />
                        </GlassCard>
                    </motion.div>
                ))}

                {accounts.length === 0 && !isAdding && (
                    <div className="md:col-span-3 py-20 text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CreditCard className="w-10 h-10 text-[var(--color-text-muted)] opacity-20" />
                        </div>
                        <h3 className="text-lg font-bold">No accounts yet</h3>
                        <p className="text-[var(--color-text-secondary)] text-sm mt-1">Add a bank or e-wallet account to start tracking.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
