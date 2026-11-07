"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { SoundToggle } from "./SoundToggle";
import { useTwitch } from "@/lib/useTwitch";
import { siteConfig, type NavItem } from "@/lib/siteConfig";
import { MenuIcon } from "./icons/MenuIcon";
import { XIcon } from "./icons/XIcon";
import { playSound } from "@/lib/sound";

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { status } = useTwitch();

  const isItemActive = (item: NavItem) => {
    if (pathname === item.href) return true;
    if (item.href !== "/" && pathname.startsWith(item.href)) return true;
    if (item.aliases?.some((alias) => pathname === alias || pathname.startsWith(alias))) return true;
    return false;
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--bg-secondary)]/92 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          {/* Left: Brand + Twitch Live Badge */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              onClick={() => playSound("click")}
              onMouseEnter={() => playSound("hover")}
              className="group flex items-center gap-2 font-mono text-sm tracking-tight"
            >
              <span className="aug-br px-2 py-0.5 bg-ctp-surface0 border border-[var(--border)] text-ctp-mauve group-hover:border-ctp-mauve transition-colors font-bold">
                &gt;_ {siteConfig.author.name}
              </span>
              <span className="text-ctp-overlay1 text-xs hidden sm:inline font-mono">
                // {siteConfig.version}
              </span>
            </Link>

            {/* Twitch Status Pill */}
            <Link
              href="/live"
              onClick={() => playSound("click")}
              onMouseEnter={() => playSound("hover")}
              className={status.isLive ? "badge-live aug-br cursor-pointer animate-pulse-glow" : "badge-offline aug-br hover:border-ctp-overlay0 transition-colors"}
              title={status.isLive ? `В эфире: ${status.title}` : "Стрим оффлайн"}
            >
              {status.isLive ? (
                <>
                  <span className="live-dot" />
                  <span>ПОДРУБИЛ</span>
                  {status.viewerCount > 0 && (
                    <span className="hidden sm:inline font-mono opacity-80">
                      [{status.viewerCount}]
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-ctp-overlay0" />
                  <span>СПИТ</span>
                </>
              )}
            </Link>
          </div>

          {/* Center/Desktop: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {siteConfig.navigation.map((item) => {
              const active = isItemActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => playSound("click")}
                  onMouseEnter={() => playSound("hover")}
                  className={`px-2.5 py-1 text-xs font-mono transition-all ${
                    active
                      ? "aug-br bg-ctp-surface0 border border-ctp-mauve/50 text-ctp-mauve font-semibold shadow-xs"
                      : "text-ctp-subtext0 hover:text-ctp-text hover:bg-ctp-surface0/50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Sound Toggle, Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-2">
            <SoundToggle />
            <ThemeToggle />

            <button
              onClick={() => {
                playSound("click");
                setMobileOpen(!mobileOpen);
              }}
              className="lg:hidden aug-br p-1.5 border border-[var(--border)] bg-ctp-surface0 text-ctp-text hover:border-ctp-mauve transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-14 right-0 bottom-0 w-80 max-w-[85vw] z-40 bg-[var(--bg-secondary)] border-l border-[var(--border)] flex flex-col lg:hidden transition-transform duration-200 ease-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-[var(--border)] bg-ctp-crust/50 font-mono text-xs text-ctp-overlay1 flex items-center justify-between">
          <span>// НАВИГАЦИЯ СТАНЦИИ</span>
          <span className="text-ctp-mauve">[SYS_OK]</span>
        </div>

        {/* Drawer Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {siteConfig.navigation.map((item) => {
            const active = isItemActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  playSound("click");
                  setMobileOpen(false);
                }}
                className={`aug-br flex items-center justify-between p-2.5 text-xs font-mono transition-all ${
                  active
                    ? "bg-ctp-surface0 border border-ctp-mauve text-ctp-mauve font-semibold"
                    : "border border-transparent text-ctp-subtext0 hover:bg-ctp-surface0/60 hover:text-ctp-text"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-ctp-overlay0 text-[10px]">[{item.code}]</span>
                  <span>{item.label}</span>
                </div>
                <span className="text-[10px] text-ctp-overlay0 truncate max-w-[100px]">
                  {item.desc}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Drawer Footer with Twitch Summary */}
        <div className="p-4 border-t border-[var(--border)] bg-ctp-crust/40 font-mono text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-ctp-overlay1">Twitch:</span>
            <a
              href={siteConfig.twitch.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ctp-mauve hover:underline"
            >
              twitch.tv/{siteConfig.twitch.channel} ↗
            </a>
          </div>
          <div className="text-[11px] text-ctp-subtext0">
            {status.isLive ? (
              <span className="text-ctp-red font-semibold">● Сейчас в эфире!</span>
            ) : (
              <span>○ Сейчас спит или кодит костыли</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
