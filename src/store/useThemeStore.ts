import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeStore {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
    theme: (typeof window !== "undefined"
        ? (localStorage.getItem("spendsantai-theme") as Theme) ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : "dark") as Theme,
    toggleTheme: () =>
        set((state) => {
            const next = state.theme === "dark" ? "light" : "dark";
            if (typeof window !== "undefined") {
                localStorage.setItem("spendsantai-theme", next);
                document.documentElement.setAttribute("data-theme", next);
            }
            return { theme: next };
        }),
    setTheme: (theme: Theme) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("spendsantai-theme", theme);
            document.documentElement.setAttribute("data-theme", theme);
        }
        set({ theme });
    },
}));
