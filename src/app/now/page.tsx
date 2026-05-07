import Link from "next/link";
import { getProfile } from "@/lib/profile";

export const dynamic = "force-dynamic";

export default function NowPage() {
  const profile = getProfile();
  const nowItems = profile?.now || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 gradient-text">/now</h1>
      
      <div className="code-block mb-8">
        <div className="flex items-center gap-2 mb-3 text-[var(--text-muted)] text-sm">
          <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
          <span>vokiry@terminal</span>
        </div>
        <pre className="text-xs sm:text-sm font-mono text-[var(--text-primary)]">
<span className="text-[var(--primary)]">$</span> cat now.txt
<span className="text-[var(--text-muted)]"># What I'm currently focused on</span></pre>
      </div>

      <div className="space-y-4">
        {nowItems.length === 0 ? (
          <div className="glass-card p-6">
            <p className="text-[var(--text-secondary)]">
              Nothing here yet. Add your current focus in the admin dashboard!
            </p>
          </div>
        ) : (
          nowItems.map((item, idx) => (
            <div key={idx} className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-2">{item.item}</h3>
              <p className="text-[var(--text-secondary)]">{item.description}</p>
            </div>
          ))
        )}
      </div>

      <div className="mt-12 flex gap-6">
        <Link href="/about" className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
          /about
        </Link>
        <Link href="/uses" className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
          /uses
        </Link>
        <Link href="/tails" className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
          /tails
        </Link>
      </div>
    </div>
  );
}