"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/siteConfig";

export function LiveTelemetryBar() {
  const [timeUtc, setTimeUtc] = useState<string>("");
  const [uptimeSec, setUptimeSec] = useState<number>(1420);
  const [pulseIndex, setPulseIndex] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeUtc(
        now.toTimeString().split(" ")[0] + " UTC"
      );
    };
    updateTime();

    const interval = setInterval(() => {
      updateTime();
      setUptimeSec((u) => u + 1);
      setPulseIndex((p) => (p + 1) % 10);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const barChars = ["░", "░", "░", "░", "░", "░", "░", "░", "░", "░"];
  for (let i = 0; i <= pulseIndex; i++) {
    barChars[i] = "█";
  }
  const unicodeBar = barChars.join("");

  return (
    <div className="panel-sharp aug-br p-3.5 bg-ctp-crust/60 border border-[var(--border)] font-mono text-xs flex flex-wrap items-center justify-between gap-3 text-ctp-subtext0">
      {/* Station ID & Clock */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-ctp-mauve font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-ctp-green animate-ping" />
          <span>{siteConfig.stationId}</span>
        </span>
        <span className="text-ctp-overlay0">//</span>
        <span className="text-ctp-text tabular-nums">{timeUtc || "00:00:00 UTC"}</span>
      </div>

      {/* Dynamic Uptime & Metrics */}
      <div className="flex items-center flex-wrap gap-4 text-[11px]">
        <div>
          <span className="text-ctp-overlay0">UPTIME: </span>
          <span className="text-ctp-text tabular-nums font-semibold">
            {formatUptime(uptimeSec)}
          </span>
        </div>

        <div className="hidden sm:inline">
          <span className="text-ctp-overlay0">BUFFER: </span>
          <span className="text-ctp-teal tracking-tighter font-bold">
            [{unicodeBar}]
          </span>
        </div>

        <div className="hidden md:inline">
          <span className="text-ctp-overlay0">LATENCY: </span>
          <span className="text-ctp-green font-semibold">14ms</span>
        </div>

        <div>
          <span className="text-ctp-overlay0">MODE: </span>
          <span className="text-ctp-peach font-semibold">VIBE_FLOW</span>
        </div>
      </div>
    </div>
  );
}
