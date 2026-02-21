"use client";

import { useEffect, useState } from "react";
import { getAccounts } from "@/actions/accounts";
import { Loader2 } from "lucide-react";

export const SummaryAccounts = ({ onSeeAll }: { onSeeAll: () => void }) => {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAccounts();
                setAccounts(data.slice(0, 3));
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
            {accounts.length > 0 ? (
                accounts.map((account) => (
                    <div key={account.id} className="flex justify-between items-center bg-white/3 p-3 rounded-lg border border-white/5">
                        <div>
                            <p className="text-xs font-medium">{account.name}</p>
                            <p className="text-[10px] text-[var(--color-text-muted)]">{account.type}</p>
                        </div>
                        <p className="text-xs font-semibold">{formatCurrency(account.balance)}</p>
                    </div>
                ))
            ) : (
                <div className="text-center py-4 bg-white/3 rounded-lg border border-dashed border-white/10">
                    <p className="text-[10px] text-[var(--color-text-muted)]">No accounts yet.</p>
                </div>
            )}
        </div>
    );
};
