import Link from "next/link";
import { getProfile } from "@/lib/profile";

const socialLinks = [
  { href: "https://github.com", label: "GitHub" },
  { href: "https://twitter.com", label: "Twitter" },
  { href: "https://t.me", label: "Telegram" },
];

export function Footer() {
  const profile = getProfile();
  const social = profile?.social;

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <span className="text-[var(--primary)]">❯</span>
            <span>© {new Date().getFullYear()} vokiry.tech</span>
          </div>

          <div className="flex items-center gap-6">
            {social?.github && (
              <a
                href={social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
              >
                GitHub
              </a>
            )}
            {social?.twitter && (
              <a
                href={social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
              >
                Twitter
              </a>
            )}
            {social?.telegram && (
              <a
                href={social.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
              >
                Telegram
              </a>
            )}
            {social?.email && (
              <a
                href={`mailto:${social.email}`}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
              >
                Email
              </a>
            )}
            <Link
              href="/rss.xml"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
            >
              RSS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}