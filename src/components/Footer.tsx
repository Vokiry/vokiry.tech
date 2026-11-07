import Link from "next/link";
import { getProfile } from "@/lib/profile";
import { siteConfig } from "@/lib/siteConfig";

export function Footer() {
  const profile = getProfile();
  const author = { ...siteConfig.author, ...profile.about };
  const socials = { ...siteConfig.socials, ...profile.social };
  const twitchUrl = profile.social?.twitch || siteConfig.twitch.channelUrl;

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)] mt-auto font-mono text-xs text-ctp-subtext0">
      {/* Decorative stripe separator */}
      <div className="h-1 w-full stripe-bg border-b border-[var(--border-subtle)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Station identifier */}
          <div className="flex items-center gap-3">
            <span className="text-ctp-mauve font-bold">&gt;_</span>
            <span className="text-ctp-text font-semibold">{author.name}.tech</span>
            <span className="text-ctp-overlay0 hidden sm:inline">//</span>
            <span className="text-ctp-overlay1 hidden sm:inline">
              {author.role}
            </span>
          </div>

          {/* Social links */}
          <div className="flex items-center flex-wrap justify-center gap-4 text-xs">
            <Link
              href="/about"
              className="text-ctp-mauve hover:underline font-semibold"
            >
              [о себе]
            </Link>
            <a
              href={twitchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ctp-mauve transition-colors"
            >
              [twitch]
            </a>
            {socials.github && (
              <a
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ctp-teal transition-colors"
              >
                [github]
              </a>
            )}
            {socials.telegram && (
              <a
                href={socials.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ctp-sapphire transition-colors"
              >
                [telegram]
              </a>
            )}
            {socials.twitter && (
              <a
                href={socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ctp-peach transition-colors"
              >
                [twitter]
              </a>
            )}
            {socials.email && (
              <a
                href={`mailto:${socials.email}`}
                className="hover:text-ctp-peach transition-colors"
              >
                [email]
              </a>
            )}
            {socials.donate && (
              <a
                href={socials.donate}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ctp-green transition-colors"
              >
                [донат]
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
