"use client";

export function StationRadarWatermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden flex items-center justify-center opacity-[0.03] dark:opacity-[0.045] select-none"
    >
      <svg
        className="w-[140vmin] h-[140vmin] animate-spin-slow text-current stroke-current"
        viewBox="0 0 800 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer dashed compass circle */}
        <circle cx="400" cy="400" r="380" strokeWidth="1" strokeDasharray="6 6" />
        <circle cx="400" cy="400" r="320" strokeWidth="0.75" />
        <circle cx="400" cy="400" r="240" strokeWidth="1" strokeDasharray="12 12" />
        <circle cx="400" cy="400" r="160" strokeWidth="0.75" />
        <circle cx="400" cy="400" r="80" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="400" cy="400" r="12" fill="currentColor" />

        {/* Crosshair lines */}
        <line x1="20" y1="400" x2="780" y2="400" strokeWidth="1" strokeDasharray="8 8" />
        <line x1="400" y1="20" x2="400" y2="780" strokeWidth="1" strokeDasharray="8 8" />
        <line x1="131" y1="131" x2="669" y2="669" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1="131" y1="669" x2="669" y2="131" strokeWidth="0.5" strokeDasharray="4 4" />

        {/* Diagonal notch marks */}
        <rect x="396" y="10" width="8" height="20" fill="currentColor" />
        <rect x="396" y="770" width="8" height="20" fill="currentColor" />
        <rect x="10" y="396" width="20" height="8" fill="currentColor" />
        <rect x="770" y="396" width="20" height="8" fill="currentColor" />
      </svg>
    </div>
  );
}
