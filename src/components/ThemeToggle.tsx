"use client";

import { useTheme } from "@/lib/theme";
import { SunIcon } from "./icons/SunIcon";
import { MoonIcon } from "./icons/MoonIcon";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className="w-8 h-8 border border-[var(--border-subtle)] bg-[var(--bg-tertiary)]" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="aug-br flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono border border-[var(--border)] bg-[var(--bg-tertiary)] hover:border-ctp-mauve hover:text-ctp-mauve text-[var(--text-secondary)] transition-all cursor-pointer"
      title={isDark ? "Переключить на Catppuccin Latte" : "Переключить на Catppuccin Mocha"}
      aria-label={`Switch theme (currently ${isDark ? "Mocha" : "Latte"})`}
    >
      {isDark ? (
        <>
          <MoonIcon className="w-3.5 h-3.5 text-ctp-mauve" />
          <span className="text-[10px] uppercase tracking-wider hidden sm:inline">Mocha</span>
        </>
      ) : (
        <>
          <SunIcon className="w-3.5 h-3.5 text-ctp-peach" />
          <span className="text-[10px] uppercase tracking-wider hidden sm:inline">Latte</span>
        </>
      )}
    </button>
  );
}
