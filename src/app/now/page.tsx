import Link from "next/link";
import { getProfile } from "@/lib/profile";
import { TerminalWindow } from "@/components/TerminalWindow";

export const dynamic = "force-dynamic";

export default function NowPage() {
  const profile = getProfile();
  const nowItems = profile?.now || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 gradient-text">~/now</h1>
      
      <div className="mb-8 animate-scale-in">
        <TerminalWindow title="~ now">
          <pre className="text-xs sm:text-sm font-mono text-[var(--text-primary)]">
<span className="text-[var(--section-accent)]">$</span> cat now.txt
<span className="text-[var(--text-muted)]"># What I'm currently focused on</span></pre>
        </TerminalWindow>
      </div>

      <div className="space-y-4 stagger-2">
        {nowItems.length === 0 ? (
          <TerminalWindow variant="minimal" className="animate-fade-in">
            <p className="text-[var(--text-secondary)]">
              Nothing here yet. Add your current focus in the admin dashboard!
            </p>
          </TerminalWindow>
        ) : (
          nowItems.map((item, idx) => (
            <div key={idx} className="terminal-card p-6 animate-slide-up" style={{ animationDelay: `${(idx + 1) * 0.1}s` }}>
              <h3 className="text-lg font-semibold mb-2">{item.item}</h3>
              <p className="text-[var(--text-secondary)]">{item.description}</p>
            </div>
          ))
        )}
      </div>

      <div className="mt-12 flex gap-6 animate-fade-in">
        <Link href="/about" className="text-[var(--text-muted)] hover:text-[var(--section-accent)] transition-colors">
          ~/about
        </Link>
        <Link href="/uses" className="text-[var(--text-muted)] hover:text-[var(--section-accent)] transition-colors">
          ~/uses
        </Link>
        <Link href="/tails" className="text-[var(--text-muted)] hover:text-[var(--section-accent)] transition-colors">
          ~/tails
        </Link>
      </div>
    </div>
  );
}