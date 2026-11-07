import Link from "next/link";
import { getProfile } from "@/lib/profile";

export const dynamic = "force-dynamic";

function ProgressBar({ value }: { value: number }) {
  const percentage = Math.max(0, Math.min(100, value));
  const filled = Math.round(percentage / 10);
  const empty = 10 - filled;
  return (
    <span className="text-ctp-lavender font-mono">
      {"█".repeat(filled)}{"░".repeat(empty)} {percentage}%
    </span>
  );
}

export default function TailsPage() {
  const profile = getProfile();
  const tails = profile?.tails || {
    status: "fluffy",
    location: "somewhere warm",
    tailLength: 85,
    energy: 65,
    napsToday: 3,
    bamboo: 12,
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* --------------------------------------------------------------------
          Header
          -------------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 font-mono text-xs text-ctp-subtext0">
          <span className="tui-chip aug-br text-ctp-lavender">[ EASTER_EGG // FASTFETCH ]</span>
          <span className="text-ctp-overlay0">//</span>
          <span>TAIL_END_OF_THE_NET</span>
        </div>

        <div>
          <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight text-ctp-text">
            ~/tails
          </h1>
          <p className="text-xs sm:text-sm text-ctp-subtext0 mt-1 font-mono">
            $ tail -f /dev/fluffiness // Secret telemetry screen
          </p>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          Fastfetch ASCII Output
          -------------------------------------------------------------------- */}
      <div className="panel-sharp aug-br p-6 bg-ctp-crust/80 border border-ctp-lavender/40 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] font-mono text-xs">
          <span className="text-ctp-lavender font-bold">&gt;_ fastfetch --tails</span>
          <span className="text-ctp-overlay0">[SYS_FETCH_OK]</span>
        </div>

        <pre className="font-mono text-xs text-ctp-text leading-relaxed overflow-x-auto whitespace-pre">
<span className="text-ctp-lavender font-bold">       /\_/\</span>    <span className="text-ctp-overlay1">TailsOS 3.0 (Catppuccin edition)</span>
<span className="text-ctp-lavender font-bold">      =(o.o)=</span>   <span className="text-ctp-subtext0">vokiry@tails-station</span>
<span className="text-ctp-lavender font-bold">       )___)</span>    <span className="text-ctp-overlay0">──────────────────────────────</span>
<span className="text-ctp-overlay0">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
  <span className="text-ctp-subtext0">species:</span>       red_panda // cat hybrid
  <span className="text-ctp-subtext0">status:</span>        <span className="text-ctp-lavender font-bold">{tails.status}</span> ✨
  <span className="text-ctp-subtext0">location:</span>      {tails.location}
<span className="text-ctp-overlay0">──────────────────────────────────────────────────</span>
  <span className="text-ctp-subtext0">tail_length:</span>   <ProgressBar value={tails.tailLength} />
  <span className="text-ctp-subtext0">energy:</span>        <ProgressBar value={tails.energy} />
  <span className="text-ctp-subtext0">naps_today:</span>    {tails.napsToday}
  <span className="text-ctp-subtext0">bamboo:</span>        {tails.bamboo} sticks
<span className="text-ctp-overlay0">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
        </pre>
      </div>

      <div className="panel-card aug-br p-5 text-xs text-ctp-subtext0 font-mono space-y-2">
        <p>
          Пасхалка для тех, кто любит копаться в маршрутах. Отсылка к утилите unix <code className="text-ctp-lavender">tail</code>.
        </p>
        <p className="text-ctp-overlay1">
          Здесь тепло, играет лоу-фай и никто не коммитит в main в пятницу вечером.
        </p>
      </div>

      <div className="pt-2 font-mono text-xs">
        <Link href="/" className="text-ctp-mauve hover:underline">
          ← Вернуться на базу (~/база)
        </Link>
      </div>
    </div>
  );
}
