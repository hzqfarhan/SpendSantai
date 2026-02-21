"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export const LogoutButton = () => {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--color-text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
        >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Sign Out</span>
        </button>
    );
};
