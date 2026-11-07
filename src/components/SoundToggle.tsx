"use client";

import { useEffect, useState } from "react";
import { initSound, isSoundEnabled, setSoundEnabled, playSound } from "@/lib/sound";

export function SoundToggle() {
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setEnabled(initSound());
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    setSoundEnabled(next);
    if (next) {
      playSound("toggle");
    }
  };

  if (!mounted) {
    return <div className="w-8 h-7 border border-[var(--border-subtle)] bg-[var(--bg-tertiary)]" />;
  }

  return (
    <button
      onClick={toggle}
      className={`aug-br flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono border transition-all cursor-pointer ${
        enabled
          ? "border-ctp-teal bg-ctp-teal/10 text-ctp-teal font-semibold"
          : "border-[var(--border)] bg-[var(--bg-tertiary)] text-ctp-overlay1 hover:border-ctp-subtext0 hover:text-ctp-text"
      }`}
      title={enabled ? "Звуковые эффекты включены (нажмите для выключения)" : "Включить ретро SFX (Web Audio)"}
      aria-label="Toggle retro UI sound effects"
    >
      <span className="text-[11px]">{enabled ? "🔊" : "🔇"}</span>
      <span className="text-[10px] uppercase tracking-wider hidden sm:inline">
        {enabled ? "SFX:ON" : "SFX:OFF"}
      </span>
    </button>
  );
}
