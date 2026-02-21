"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";

export function ThemeInitializer() {
    const { theme, setTheme } = useThemeStore();

    useEffect(() => {
        // Read from localStorage or system preference on mount
        const stored = localStorage.getItem("spendsantai-theme") as "light" | "dark" | null;
        const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        const resolvedTheme = stored || preferred;

        document.documentElement.setAttribute("data-theme", resolvedTheme);
        setTheme(resolvedTheme);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Keep data-theme attribute in sync
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    return null;
}
