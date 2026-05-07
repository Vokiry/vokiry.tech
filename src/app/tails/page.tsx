import Link from "next/link";
import { getProfile } from "@/lib/profile";

export const dynamic = "force-dynamic";

function ProgressBar({ value }: { value: number }) {
  const percentage = Math.max(0, Math.min(100, value));
  const filled = Math.round(percentage / 10);
  const empty = 10 - filled;
  return (
    <span className="font-mono">
      {"█".repeat(filled)}{"░".repeat(empty)} {percentage}%
    </span>
  );
}

export default function TailsPage() {
  const profile = getProfile();
  const tails = profile?.tails || { status: "fluffy", location: "somewhere warm", tailLength: 50, energy: 50, napsToday: 0, bamboo: 0 };

  const asciiArt = [
    "$ tails -n 10",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄",
    "     ▄▄▄   Red Panda   ▄▄▄",
    "   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄",
    "  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄",
    "  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "  species:     red_panda",
    "  colors:      teal, cyan, red",
    "  status:      " + tails.status + " ✨",
    "  location:    " + tails.location,
    "  ─────────────────────────────────",
    "  tail_length:   ",
    "  energy:        ",
    "  naps_today:     " + tails.napsToday,
    "  bamboo:        " + tails.bamboo + " sticks eaten",
    "  ██▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄",
  ].join("\n");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 gradient-text">/tails</h1>
      
      <div className="code-block mb-8">
        <div className="flex items-center gap-2 mb-4 text-[var(--text-muted)] text-sm">
          <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
          <span>vokiry@terminal</span>
        </div>
        <pre className="text-[var(--text-primary)] font-mono text-xs sm:text-sm whitespace-pre">
{asciiArt.split("\n").slice(0, 13).join("\n")}
<ProgressBar value={tails.tailLength} />
{"\n" + asciiArt.split("\n").slice(14, 15).join("\n")}
<ProgressBar value={tails.energy} />
{"\n" + asciiArt.split("\n").slice(15).join("\n")}
</pre>
      </div>

      <div className="glass-card p-6">
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Just a little something for the curious. Think of this as the tail end of the internet - 
          a place where the interesting bits are.
        </p>
        <p className="text-[var(--text-muted)] text-sm mt-4">
          (It also plays on the Unix <code>tail</code> command - get the last lines of a file. 
          But instead, you get the last... tail.)
        </p>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}