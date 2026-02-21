"use client";

import { TopCards } from "@/components/dashboard/TopCards";
import { MainChart } from "@/components/dashboard/MainChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { TransactionsView } from "@/components/dashboard/TransactionsView";
import { AccountsView } from "@/components/dashboard/AccountsView";
import { BudgetsView } from "@/components/dashboard/BudgetsView";
import { GoalsView } from "@/components/dashboard/GoalsView";
import { SettingsView } from "@/components/dashboard/SettingsView";
import { SummaryAccounts } from "@/components/dashboard/SummaryAccounts";
import { SummaryBudgets } from "@/components/dashboard/SummaryBudgets";
import { SummaryGoals } from "@/components/dashboard/SummaryGoals";
import Image from "next/image";
import {
    Plus,
    LayoutDashboard,
    History,
    Settings,
    Bell,
    Search,
    Wallet,
    PieChart,
    Target,
    ArrowRight,
    Sun,
    Moon,
    Menu,
    X,
} from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { useThemeStore } from "@/store/useThemeStore";
import { AddTransactionModal } from "@/components/dashboard/AddTransactionModal";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
    const { setIsAddModalOpen } = useFinanceStore();
    const { theme, toggleTheme } = useThemeStore();
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState("Overview");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { icon: LayoutDashboard, label: "Overview" },
        { icon: History, label: "Transactions" },
        { icon: Wallet, label: "Accounts & Cards" },
        { icon: PieChart, label: "Budgets" },
        { icon: Target, label: "Goals" },
        { icon: Settings, label: "Settings" },
    ];

    // Bottom nav items (subset for mobile)
    const bottomNavItems = [
        { icon: LayoutDashboard, label: "Overview" },
        { icon: History, label: "Transactions" },
        { icon: Wallet, label: "Accounts & Cards" },
        { icon: PieChart, label: "Budgets" },
        { icon: Settings, label: "Settings" },
    ];

    const userImage = (session?.user as any)?.image;
    const userName = session?.user?.name || "User";
    const userInitials = userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

    const renderContent = () => {
        switch (activeTab) {
            case "Overview":
                return (
                    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 lg:space-y-10">
                        <section>
                            <div className="mb-6 flex justify-between items-end">
                                <div>
                                    <h1 className="text-2xl lg:text-3xl font-bold text-[var(--color-text-primary)]">Hi, {userName.split(" ")[0]}!</h1>
                                    <p className="text-[var(--color-text-secondary)] mt-1 text-sm lg:text-base">Here is a snapshot of your finances today.</p>
                                </div>
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs text-[var(--color-text-muted)] uppercase font-bold tracking-widest">Local Time</p>
                                    <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                                        {new Date().toLocaleDateString('en-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <TopCards />
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                            <GlassCard className="p-4 lg:p-5">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-sm font-semibold">Accounts</h4>
                                    <button onClick={() => setActiveTab("Accounts & Cards")} className="text-xs text-[var(--color-accent-light)] font-medium hover:underline">View all</button>
                                </div>
                                <SummaryAccounts onSeeAll={() => setActiveTab("Accounts & Cards")} />
                            </GlassCard>

                            <GlassCard className="p-4 lg:p-5">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-sm font-semibold">This Month&apos;s Budgets</h4>
                                    <button onClick={() => setActiveTab("Budgets")} className="text-xs text-[var(--color-accent-light)] font-medium hover:underline">Manage</button>
                                </div>
                                <SummaryBudgets onSeeAll={() => setActiveTab("Budgets")} />
                            </GlassCard>

                            <GlassCard className="p-4 lg:p-5">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-sm font-semibold">Saving Goals</h4>
                                    <button onClick={() => setActiveTab("Goals")} className="text-xs text-[var(--color-accent-light)] font-medium hover:underline">Add</button>
                                </div>
                                <SummaryGoals onSeeAll={() => setActiveTab("Goals")} />
                            </GlassCard>
                        </section>

                        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                            <div className="lg:col-span-2">
                                <MainChart />
                            </div>
                            <div className="lg:col-span-1">
                                <div className="mb-4 flex justify-between items-center">
                                    <h3 className="font-semibold">Recent Transactions</h3>
                                    <button onClick={() => setActiveTab("Transactions")} className="text-xs text-[var(--color-accent-light)] font-medium hover:underline flex items-center gap-1">
                                        View all <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                                <RecentTransactions />
                            </div>
                        </section>
                    </div>
                );
            case "Transactions":
                return <div className="p-4 lg:p-8 max-w-7xl mx-auto"><TransactionsView /></div>;
            case "Accounts & Cards":
                return <div className="p-4 lg:p-8 max-w-7xl mx-auto"><AccountsView /></div>;
            case "Budgets":
                return <div className="p-4 lg:p-8 max-w-7xl mx-auto"><BudgetsView /></div>;
            case "Goals":
                return <div className="p-4 lg:p-8 max-w-7xl mx-auto"><GoalsView /></div>;
            case "Settings":
                return <div className="p-4 lg:p-8 max-w-4xl mx-auto"><SettingsView /></div>;
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen font-sans selection:bg-[var(--color-accent)]/20">
            {/* Desktop Sidebar */}
            <aside className="w-64 border-r border-[var(--color-border-glass)] bg-[var(--color-bg-secondary)]/80 backdrop-blur-xl flex-col p-6 hidden lg:flex">
                <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => setActiveTab("Overview")}>
                    <Image src="/logo.svg" alt="SpendSantai" width={32} height={32} />
                    <h1 className="text-xl font-bold tracking-tight">
                        SpendSantai
                    </h1>
                </div>

                <nav className="flex-1 space-y-1">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => setActiveTab(item.label)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${activeTab === item.label
                                ? "bg-[var(--color-accent)]/10 text-[var(--color-accent-light)] font-medium border border-[var(--color-accent)]/20"
                                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-glass-hover)] hover:text-[var(--color-text-primary)]"
                                } font-semibold text-sm`}
                        >
                            <item.icon className="w-4 h-4" />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-[var(--color-border-glass)] space-y-2">
                    {/* Theme toggle in sidebar */}
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-glass-hover)] hover:text-[var(--color-text-primary)] transition-all duration-200 font-semibold text-sm"
                    >
                        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                    </button>
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
                {/* Header */}
                <header className="px-4 lg:px-8 py-4 lg:py-6 border-b border-[var(--color-border-glass)] bg-[var(--color-bg-primary)]/60 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Mobile logo */}
                        <div className="lg:hidden flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab("Overview")}>
                            <Image src="/logo.svg" alt="SpendSantai" width={28} height={28} />
                        </div>
                        <h2 className="text-base lg:text-lg font-black uppercase tracking-wider">{activeTab}</h2>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-4">
                        <div className="relative group hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="glass-input !py-2 !pl-10 !pr-4 w-64"
                            />
                        </div>

                        {/* Theme toggle in header (mobile) */}
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-glass-hover)] rounded-xl transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <button className="p-2.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-glass-hover)] rounded-xl transition-all relative min-w-[44px] min-h-[44px] flex items-center justify-center">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full" />
                        </button>

                        {/* Profile avatar */}
                        <button
                            onClick={() => setActiveTab("Settings")}
                            className="w-9 h-9 rounded-full overflow-hidden border-2 border-[var(--color-border-glass-active)] flex-shrink-0 flex items-center justify-center bg-[var(--color-accent)]/20 text-[var(--color-accent-light)] font-bold text-xs"
                        >
                            {userImage ? (
                                <img src={userImage} alt={userName} className="w-full h-full object-cover" />
                            ) : (
                                userInitials
                            )}
                        </button>

                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="btn-primary !py-2 !px-3 lg:!px-4 text-sm font-bold flex items-center gap-2 !min-h-[44px]"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">Add Transaction</span>
                        </button>
                    </div>
                </header>

                <div className="min-h-[calc(100vh-88px)]">
                    {renderContent()}
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-bg-secondary)]/90 backdrop-blur-2xl border-t border-[var(--color-border-glass)] px-2 py-1 safe-area-bottom">
                <div className="flex items-center justify-around">
                    {bottomNavItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => setActiveTab(item.label)}
                            className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all min-w-[56px] min-h-[48px] ${activeTab === item.label
                                    ? "text-[var(--color-accent-light)]"
                                    : "text-[var(--color-text-muted)]"
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-[10px] font-semibold leading-tight">
                                {item.label === "Accounts & Cards" ? "Accounts" : item.label}
                            </span>
                        </button>
                    ))}
                </div>
            </nav>

            <AddTransactionModal />
        </div>
    );
}
