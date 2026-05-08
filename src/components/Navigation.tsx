"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TerminalIcon } from "./icons/TerminalIcon";
import { MenuIcon } from "./icons/MenuIcon";
import { XIcon } from "./icons/XIcon";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/guestbook", label: "Guestbook" },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-md">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <span className="text-[var(--section-accent)] animate-blink">❯</span>
            <span className="gradient-text">vokiry</span>
            <span className="text-[var(--text-muted)]">.tech</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm transition-all ${
                    isActive 
                      ? "bg-[var(--section-glow)] text-[var(--section-accent)]" 
                      : "text-[var(--text-secondary)] hover:text-[var(--section-accent)] hover:bg-[var(--bg-secondary)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <Link
              href="/utilities"
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--section-accent)] text-sm transition-all hover-glow"
            >
              <TerminalIcon className="w-4 h-4 text-[var(--section-accent)]" />
              <span>Utilities</span>
            </Link>

            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--section-accent)] hover:bg-[var(--bg-secondary)] transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <XIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--border)] animate-slide-down">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[var(--text-secondary)] hover:text-[var(--section-accent)] transition-colors py-2 px-3 rounded-md hover:bg-[var(--bg-secondary)]"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/utilities"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-3 rounded-md bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)]"
              >
                <TerminalIcon className="w-4 h-4 text-[var(--section-accent)]" />
                <span>Utilities</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}