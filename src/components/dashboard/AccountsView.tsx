"use client";

import { useEffect, useState, useRef } from "react";
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
    ArrowLeft,
    Check,
    ChevronDown,
    Search,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";
import { MALAYSIAN_BANKS, getBanksByType } from "@/lib/malaysianBanks";

export const AccountsView = () => {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedType, setSelectedType] = useState("BANK");
    const [accountName, setAccountName] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownSearch, setDropdownSearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        const formData = new FormData(e.currentTarget);

        try {
            const result = await addAccount({
                name: accountName || (formData.get("name") as string),
                type: selectedType,
                balance: parseFloat(formData.get("balance") as string),
            });

            if (result.error) {
                alert(result.error);
            } else {
                setIsAdding(false);
                setShowSuccess(true);
                setAccountName("");
                setDropdownSearch("");
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

    const filteredBanks = (selectedType === "BANK" || selectedType === "E-WALLET")
        ? getBanksByType(selectedType as "BANK" | "E-WALLET").filter(b =>
            b.name.toLowerCase().includes(dropdownSearch.toLowerCase())
        )
        : [];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-[var(--color-text-secondary)]">
                <Loader2 className="w-10 h-10 animate-spin text-[var(--color-accent-light)]" />
                <p className="font-medium">Connecting to your accounts...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 lg:space-y-8">
            {/* Success state with back button */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <GlassCard className="p-6 border-emerald-500/20">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                    <Check className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-emerald-400">Account Added Successfully!</h3>
                                    <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">Your new account is now being tracked.</p>
                                </div>
                                <button
                                    onClick={() => setShowSuccess(false)}
                                    className="btn-secondary !py-2.5 !px-4 text-sm font-bold flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Accounts
                                </button>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl lg:text-2xl font-bold">Accounts</h2>
                    <p className="text-[var(--color-text-secondary)] text-sm">Manage all your banks and wallets in one place.</p>
                </div>
                <button
                    onClick={() => { setIsAdding(!isAdding); setShowSuccess(false); }}
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
                        <GlassCard className="p-4 lg:p-6 border-[var(--color-accent)]/20 glow-accent">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                                {/* Account Type */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase">Type</label>
                                    <select
                                        value={selectedType}
                                        onChange={(e) => {
                                            setSelectedType(e.target.value);
                                            setAccountName("");
                                            setDropdownSearch("");
                                        }}
                                        className="glass-input cursor-pointer"
                                    >
                                        <option value="BANK">Bank</option>
                                        <option value="E-WALLET">E-Wallet</option>
                                        <option value="CASH">Cash</option>
                                    </select>
                                </div>

                                {/* Account Name with Dropdown */}
                                <div className="space-y-1.5 relative" ref={dropdownRef}>
                                    <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase">Account Name</label>
                                    {(selectedType === "BANK" || selectedType === "E-WALLET") ? (
                                        <>
                                            <div
                                                className="glass-input flex items-center justify-between cursor-pointer"
                                                onClick={() => setShowDropdown(!showDropdown)}
                                            >
                                                <span className={accountName ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]"}>
                                                    {accountName || `Select ${selectedType === "BANK" ? "bank" : "e-wallet"}...`}
                                                </span>
                                                <ChevronDown className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform ${showDropdown ? "rotate-180" : ""}`} />
                                            </div>
                                            <AnimatePresence>
                                                {showDropdown && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -8 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -8 }}
                                                        className="absolute top-full left-0 right-0 mt-1 z-50 glass-card p-2 max-h-60 overflow-y-auto"
                                                    >
                                                        <div className="relative mb-2">
                                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                                                            <input
                                                                type="text"
                                                                placeholder="Search..."
                                                                value={dropdownSearch}
                                                                onChange={(e) => setDropdownSearch(e.target.value)}
                                                                className="glass-input !py-2 !pl-9 !text-sm"
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        </div>
                                                        {filteredBanks.map((bank) => (
                                                            <button
                                                                key={bank.name}
                                                                type="button"
                                                                className="w-full text-left px-3 py-2.5 rounded-lg text-sm hover:bg-[var(--color-bg-glass-hover)] text-[var(--color-text-primary)] transition-colors min-h-[44px] flex items-center"
                                                                onClick={() => {
                                                                    setAccountName(bank.name);
                                                                    setShowDropdown(false);
                                                                    setDropdownSearch("");
                                                                }}
                                                            >
                                                                {bank.name}
                                                            </button>
                                                        ))}
                                                        {filteredBanks.length === 0 && (
                                                            <p className="text-sm text-[var(--color-text-muted)] p-3 text-center">No results found</p>
                                                        )}
                                                        <div className="border-t border-[var(--color-border-glass)] mt-1 pt-1">
                                                            <button
                                                                type="button"
                                                                className="w-full text-left px-3 py-2.5 rounded-lg text-sm hover:bg-[var(--color-bg-glass-hover)] text-[var(--color-accent-light)] transition-colors min-h-[44px] flex items-center gap-2"
                                                                onClick={() => {
                                                                    const custom = prompt("Enter custom account name:");
                                                                    if (custom) {
                                                                        setAccountName(custom);
                                                                        setShowDropdown(false);
                                                                    }
                                                                }}
                                                            >
                                                                <Plus className="w-3.5 h-3.5" />
                                                                Enter custom name
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </>
                                    ) : (
                                        <input
                                            name="name"
                                            required
                                            placeholder="e.g. Cash in hand"
                                            value={accountName}
                                            onChange={(e) => setAccountName(e.target.value)}
                                            className="glass-input"
                                        />
                                    )}
                                </div>

                                {/* Balance */}
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

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={saving || (!accountName && selectedType !== "CASH")}
                                        className="flex-1 btn-primary !py-2 text-sm font-bold disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Save"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setIsAdding(false); setAccountName(""); setDropdownSearch(""); }}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {accounts.map((acc) => (
                    <motion.div
                        key={acc.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="group"
                    >
                        <GlassCard className="p-5 lg:p-6 hover:glow-accent transition-all cursor-pointer overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(acc.id); }}
                                    className="p-2 text-[var(--color-text-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
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

                                <div className="pt-4 border-t border-[var(--color-border-glass)] flex justify-between items-center text-[10px] text-[var(--color-text-muted)] font-medium">
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
                        <div className="w-20 h-20 bg-[var(--color-bg-glass)] rounded-full flex items-center justify-center mx-auto mb-4">
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
