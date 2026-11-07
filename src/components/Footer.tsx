import Link from "next/link";
import { getProfile } from "@/lib/profile";

export function Footer() {
  const profile = getProfile();
  const social = profile?.social;

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)] mt-auto font-mono text-xs text-ctp-subtext0">
      {/* Decorative stripe separator */}
      <div className="h-1 w-full stripe-bg border-b border-[var(--border-subtle)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Station identifier */}
          <div className="flex items-center gap-3">
            <span className="text-ctp-mauve font-bold">&gt;_</span>
            <span className="text-ctp-text font-semibold">vokiry.tech</span>
            <span className="text-ctp-overlay0 hidden sm:inline">//</span>
            <span className="text-ctp-overlay1 hidden sm:inline">
              вайбкод &bull; стримы &bull; медианищета
            </span>
          </div>

          {/* Social links */}
          <div className="flex items-center flex-wrap justify-center gap-4 text-xs">
            <a
              href="https://twitch.tv/vokiry"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ctp-mauve transition-colors"
            >
              [twitch]
            </a>
            {social?.github && (
              <a
                href={social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ctp-teal transition-colors"
              >
                [github]
              </a>
            )}
            {social?.telegram && (
              <a
                href={social.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ctp-sapphire transition-colors"
              >
                [telegram]
              </a>
            )}
            {social?.email && (
              <a
                href={`mailto:${social.email}`}
                className="hover:text-ctp-peach transition-colors"
              >
                [email]
              </a>
            )}
            <Link
              href="/rss.xml"
              className="hover:text-ctp-yellow transition-colors"
            >
              [rss]
            </Link>
          </div>

          {/* System status */}
          <div className="text-[11px] text-ctp-overlay0">
            SYS_STATUS: <span className="text-ctp-green">OPERATIONAL</span> // {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </footer>
  );
}
