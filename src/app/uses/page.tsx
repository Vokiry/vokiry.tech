import Link from "next/link";
import { getProfile } from "@/lib/profile";

export const dynamic = "force-dynamic";

export default function UsesPage() {
  const profile = getProfile();
  const uses = profile?.uses || { hardware: [], software: [] };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 gradient-text">/uses</h1>
      
      <div className="code-block mb-8">
        <div className="flex items-center gap-2 mb-3 text-[var(--text-muted)] text-sm">
          <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
          <span>vokiry@terminal</span>
        </div>
        <pre className="text-xs sm:text-sm font-mono text-[var(--text-primary)]">
<span className="text-[var(--primary)]">$</span> cat uses.txt
<span className="text-[var(--text-muted)]"># Tools and hardware I use daily</span></pre>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Hardware</h2>
          {uses.hardware.length === 0 ? (
            <p className="text-[var(--text-muted)]">Add hardware in admin dashboard!</p>
          ) : (
            <ul className="space-y-2">
              {uses.hardware.map((item) => (
                <li key={item} className="text-[var(--text-secondary)]">{item}</li>
              ))}
            </ul>
          )}
        </section>

        <section className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Software</h2>
          {uses.software.length === 0 ? (
            <p className="text-[var(--text-muted)]">Add software in admin dashboard!</p>
          ) : (
            <ul className="space-y-2">
              {uses.software.map((item) => (
                <li key={item} className="text-[var(--text-secondary)]">{item}</li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-12 flex gap-6">
        <Link href="/about" className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
          /about
        </Link>
        <Link href="/now" className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
          /now
        </Link>
        <Link href="/tails" className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
          /tails
        </Link>
      </div>
    </div>
  );
}