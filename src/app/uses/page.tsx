import Link from "next/link";
import { getProfile } from "@/lib/profile";
import { TerminalWindow } from "@/components/TerminalWindow";

export const dynamic = "force-dynamic";

export default function UsesPage() {
  const profile = getProfile();
  const uses = profile?.uses || { hardware: [], software: [] };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 gradient-text">~/uses</h1>
      
      <div className="mb-8 animate-scale-in">
        <TerminalWindow title="~ uses">
          <pre className="text-xs sm:text-sm font-mono text-[var(--text-primary)]">
<span className="text-[var(--section-accent)]">$</span> cat uses.txt
<span className="text-[var(--text-muted)]"># Tools and hardware I use daily</span></pre>
        </TerminalWindow>
      </div>

      <div className="grid md:grid-cols-2 gap-6 stagger-2">
        <section className="terminal-card p-6 animate-slide-up">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-[var(--section-accent)]">~/hardware</span>
          </h2>
          {uses.hardware.length === 0 ? (
            <p className="text-[var(--text-muted)]">Add hardware in admin dashboard!</p>
          ) : (
            <ul className="space-y-2">
              {uses.hardware.map((item) => (
                <li key={item} className="text-[var(--text-secondary)] flex items-center gap-2">
                  <span className="text-[var(--section-accent)]">›</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="terminal-card p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-[var(--section-accent)]">~/software</span>
          </h2>
          {uses.software.length === 0 ? (
            <p className="text-[var(--text-muted)]">Add software in admin dashboard!</p>
          ) : (
            <ul className="space-y-2">
              {uses.software.map((item) => (
                <li key={item} className="text-[var(--text-secondary)] flex items-center gap-2">
                  <span className="text-[var(--section-accent)]">›</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-12 flex gap-6 animate-fade-in">
        <Link href="/about" className="text-[var(--text-muted)] hover:text-[var(--section-accent)] transition-colors">
          ~/about
        </Link>
        <Link href="/now" className="text-[var(--text-muted)] hover:text-[var(--section-accent)] transition-colors">
          ~/now
        </Link>
        <Link href="/tails" className="text-[var(--text-muted)] hover:text-[var(--section-accent)] transition-colors">
          ~/tails
        </Link>
      </div>
    </div>
  );
}