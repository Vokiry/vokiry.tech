import Link from "next/link";
import { getProfile } from "@/lib/profile";
import { TerminalWindow } from "@/components/TerminalWindow";

export const dynamic = "force-dynamic";

function ProgressBar({ value }: { value: number }) {
  const percentage = Math.max(0, Math.min(100, value));
  const filled = Math.round(percentage / 10);
  const empty = 10 - filled;
  return (
    <span className="font-mono text-[var(--tails)]">
      {"█".repeat(filled)}{"░".repeat(empty)} {percentage}%
    </span>
  );
}

export default function TailsPage() {
  const profile = getProfile();
  const tails = profile?.tails || { status: "fluffy", location: "somewhere warm", tailLength: 50, energy: 50, napsToday: 0, bamboo: 0 };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 gradient-text">/tails</h1>
      
      <TerminalWindow title="~ tails -n 10" className="mb-8 animate-scale-in">
        <pre className="text-[var(--text-primary)] font-mono text-xs sm:text-sm">
<span className="text-[var(--tails)]">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
     ▄▄▄   Red Panda   ▄▄▄
   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  species:     red_panda
  colors:      teal, cyan, red
  status:      </span><span className="text-[var(--tails-light)]">{tails.status}</span><span className="text-[var(--tails)]"> ✨
  location:    </span>{tails.location}
<span className="text-[var(--tails)]">  ─────────────────────────────────
  tail_length:   </span><ProgressBar value={tails.tailLength} />
<span className="text-[var(--tails)]">
  energy:        </span><ProgressBar value={tails.energy} />
<span className="text-[var(--tails)]">
  naps_today:     </span>{tails.napsToday}
<span className="text-[var(--tails)]">
  bamboo:        </span>{tails.bamboo} sticks eaten
<span className="text-[var(--tails)]">
  ██▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄</span></pre>
      </TerminalWindow>

      <div className="glass-card p-6 animate-slide-up">
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Just a little something for the curious. Think of this as the tail end of the internet - 
          a place where the interesting bits are.
        </p>
        <p className="text-[var(--text-muted)] text-sm mt-4">
          (It also plays on the Unix <code className="text-[var(--tails)]">tail</code> command - get the last lines of a file. 
          But instead, you get the last... tail.)
        </p>
      </div>

      <div className="mt-8 animate-fade-in">
        <Link href="/" className="text-[var(--text-muted)] hover:text-[var(--section-accent)] transition-colors">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}