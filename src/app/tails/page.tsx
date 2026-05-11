import Link from "next/link";
import { getProfile } from "@/lib/profile";
import { TerminalWindow } from "@/components/TerminalWindow";

export const dynamic = "force-dynamic";

function ProgressBar({ value }: { value: number }) {
  const percentage = Math.max(0, Math.min(100, value));
  const filled = Math.round(percentage / 10);
  const empty = 10 - filled;
  return (
    <span className="text-[var(--tails)]">
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
      
      <TerminalWindow title="~ fastfetch" className="mb-8 animate-scale-in">
        <div className="font-mono text-xs text-[var(--text-primary)] leading-relaxed">
<span className="text-[var(--tails)]">       /\_/\</span><span className="text-[var(--text-muted)]">    TailsOS 1.0</span><br/>
<span className="text-[var(--tails)]">      =(o.o)=</span><br/>
<span className="text-[var(--tails)]">       )___)</span><span className="text-[var(--text-muted)]">    red_panda@tails</span><br/>
<span className="text-[var(--section-accent)]">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span><br/>
<span className="text-[var(--text-muted)]">  species:</span>      red_panda<br/>
<span className="text-[var(--text-muted)]">  status:</span>       <span className="text-[var(--tails)]">{tails.status}</span> ✨<br/>
<span className="text-[var(--text-muted)]">  location:</span>    {tails.location}<br/>
<span className="text-[var(--section-accent)]">────────────────────────────────────</span><br/>
<span className="text-[var(--text-muted)]">  tail_length:</span>    <ProgressBar value={tails.tailLength} /><br/>
<span className="text-[var(--text-muted)]">  energy:</span>       <ProgressBar value={tails.energy} /><br/>
<span className="text-[var(--text-muted)]">  naps_today:</span>    {tails.napsToday}<br/>
<span className="text-[var(--text-muted)]">  bamboo:</span>       {tails.bamboo} sticks<br/>
<span className="text-[var(--section-accent)]">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
        </div>
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