"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TerminalIcon } from "./icons/TerminalIcon";
import { MenuIcon } from "./icons/MenuIcon";
import { XIcon } from "./icons/XIcon";
import { HomeIcon } from "./icons/HomeIcon";
import { UserIcon } from "./icons/UserIcon";
import { CodeIcon } from "./icons/CodeIcon";
import { BookIcon } from "./icons/BookIcon";
import { MailIcon } from "./icons/MailIcon";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/about", label: "About", icon: "user" },
  { href: "/portfolio", label: "Portfolio", icon: "code" },
  { href: "/blog", label: "Blog", icon: "book" },
  { href: "/guestbook", label: "Guestbook", icon: "mail" },
];

const icons: Record<string, React.ReactNode> = {
  home: <HomeIcon className="w-4 h-4" />,
  user: <UserIcon className="w-4 h-4" />,
  code: <CodeIcon className="w-4 h-4" />,
  book: <BookIcon className="w-4 h-4" />,
  mail: <MailIcon className="w-4 h-4" />,
};

export function Navigation() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--section-accent)] transition-all md:hidden"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 flex-col bg-[var(--bg-secondary)] border-r border-[var(--border)] z-40">
        {/* Logo */}
        <div className="p-6 border-b border-[var(--border)]">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <span className="text-[var(--section-accent)] animate-blink">❯</span>
            <span className="gradient-text">vokiry</span>
            <span className="text-[var(--text-muted)]">.tech</span>
          </Link>
        </div>

        {/* Nav Links - Tree Style */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive 
                    ? "bg-[var(--section-glow)] text-[var(--section-accent)] border-l-2 border-[var(--section-accent)]" 
                    : "text-[var(--text-secondary)] hover:text-[var(--section-accent)] hover:bg-[var(--bg-card)]"
                }`}
              >
                {icons[item.icon]}
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Divider */}
          <div className="border-t border-[var(--border)] my-4"></div>

          {/* Secondary Links */}
          <Link
            href="/utilities"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--section-accent)] hover:bg-[var(--bg-card)] transition-all"
          >
            <TerminalIcon className="w-4 h-4" />
            <span>Utilities</span>
          </Link>

          <Link
            href="/now"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--section-accent)] hover:bg-[var(--bg-card)] transition-all"
          >
            <span className="w-4 text-center font-mono">~</span>
            <span>now</span>
          </Link>

          <Link
            href="/uses"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--section-accent)] hover:bg-[var(--bg-card)] transition-all"
          >
            <span className="w-4 text-center font-mono">$</span>
            <span>uses</span>
          </Link>

          <Link
            href="/contact"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--section-accent)] hover:bg-[var(--bg-card)] transition-all"
          >
            <MailIcon className="w-4 h-4" />
            <span>Contact</span>
          </Link>
        </nav>

        {/* Bottom - Theme Toggle */}
        <div className="p-4 border-t border-[var(--border)]">
          <ThemeToggle />
        </div>
      </aside>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-30 bg-black/50 md:hidden transition-opacity ${
        mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}>
        <div className={`absolute left-0 top-0 h-full w-72 bg-[var(--bg-secondary)] border-r border-[var(--border)] transform transition-transform ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          {/* Logo */}
          <div className="p-6 border-b border-[var(--border)]">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold" onClick={() => setMobileOpen(false)}>
              <span className="text-[var(--section-accent)]">❯</span>
              <span className="gradient-text">vokiry</span>
              <span className="text-[var(--text-muted)]">.tech</span>
            </Link>
          </div>

          {/* Nav */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive 
                      ? "bg-[var(--section-glow)] text-[var(--section-accent)]" 
                      : "text-[var(--text-secondary)] hover:text-[var(--section-accent)] hover:bg-[var(--bg-card)]"
                  }`}
                >
                  {icons[item.icon]}
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="border-t border-[var(--border)] my-4"></div>

            <Link href="/utilities" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--section-accent)]">
              <TerminalIcon className="w-4 h-4" />
              <span>Utilities</span>
            </Link>
            <Link href="/now" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--section-accent)]">
              <span className="w-4 font-mono">~</span><span>now</span>
            </Link>
<Link href="/uses" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--section-accent)]">
              <span className="w-4 font-mono">$</span><span>uses</span>
            </Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--section-accent)]">
              <MailIcon className="w-4 h-4" /><span>Contact</span>
            </Link>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border)]">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content - Add left margin on desktop for sidebar */}
      <div className="hidden md:block md:ml-64">
      </div>
    </>
  );
}