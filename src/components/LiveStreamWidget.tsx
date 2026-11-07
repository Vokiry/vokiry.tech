"use client";

import { useTwitch } from "@/lib/useTwitch";
import Link from "next/link";

export function LiveStreamWidget() {
  const { status, loading } = useTwitch();

  return (
    <div className="panel-sharp aug-br p-5 sm:p-6 relative overflow-hidden bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-card)]">
      {/* Decorative top-right stripes */}
      <div className="absolute top-0 right-0 w-32 h-16 stripe-bg opacity-40 pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-ctp-overlay0 uppercase tracking-wider">
            [ broadcast_feed ]
          </span>
          <span className="text-ctp-overlay0 text-xs font-mono">//</span>
          <span className="text-xs font-mono text-ctp-subtext0">
            twitch.tv/{status.channel}
          </span>
        </div>

        <div>
          {loading ? (
            <span className="badge-offline aug-br text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-ctp-overlay0 animate-pulse" />
              <span>ОПРОС СЕРВЕРА...</span>
            </span>
          ) : status.isLive ? (
            <span className="badge-live aug-br text-xs">
              <span className="live-dot" />
              <span>LIVE: В ЭФИРЕ</span>
              {status.viewerCount > 0 && <span>({status.viewerCount})</span>}
            </span>
          ) : (
            <span className="badge-offline aug-br text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-ctp-overlay0" />
              <span>ОФФЛАЙН // ОТДЫХ</span>
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {status.isLive ? (
          <div>
            <div className="inline-block px-2 py-0.5 mb-2 text-[11px] font-mono bg-ctp-red/10 text-ctp-red border border-ctp-red/30">
              Категория: {status.gameName}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-ctp-text leading-tight">
              {status.title}
            </h3>
            <p className="text-xs sm:text-sm text-ctp-subtext0 mt-2 font-mono">
              Подруб активен прямо сейчас. Нажимай кнопку ниже, залетай в чат, задавай вопросы или просто вайбуй!
            </p>
          </div>
        ) : (
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-display text-ctp-text">
              Стрим спит, автор кодит костыли
            </h3>
            <p className="text-xs sm:text-sm text-ctp-subtext0 mt-1">
              Эфир сейчас не идёт. Но можно подписаться на канал на Twitch и Telegram, чтобы получить уведомление о следующем подрубе.
            </p>
          </div>
        )}

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href={status.channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="aug-br inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold bg-ctp-mauve text-ctp-base hover:opacity-90 transition-opacity cursor-pointer"
          >
            {status.isLive ? "▶ Смотреть на Twitch" : "↗ Открыть канал на Twitch"}
          </a>

          <Link
            href="/live"
            className="aug-br inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono border border-[var(--border)] text-ctp-text hover:border-ctp-mauve hover:text-ctp-mauve transition-colors"
          >
            [ детали подруба &amp; команды ]
          </Link>
        </div>
      </div>
    </div>
  );
}
