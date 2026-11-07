"use client";

import { useTwitch } from "@/lib/useTwitch";
import Link from "next/link";
import { useEffect, useState } from "react";

const CHAT_COMMANDS = [
  { cmd: "!git", desc: "Ссылка на GitHub со всеми открытыми костылями" },
  { cmd: "!setup", desc: "Сетап медианищеты и рабочее железо" },
  { cmd: "!tg", desc: "Телеграм-канал с анонсами и щитпостингом" },
  { cmd: "!костыли", desc: "Текущий проект, над которым сейчас потеем" },
  { cmd: "!музыка", desc: "Плейлист со стрима или текущий трек" },
  { cmd: "!дроп", desc: "Узнать, когда следующий запланированный подруб" },
];

export default function LivePage() {
  const { status, loading } = useTwitch();
  const [hostname, setHostname] = useState("vokiry.tech");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHostname(window.location.hostname);
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* --------------------------------------------------------------------
          Header
          -------------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 font-mono text-xs text-ctp-subtext0">
          <span className="tui-chip aug-br text-ctp-red">[ 02 // ПОДРУБ ]</span>
          <span className="text-ctp-overlay0">//</span>
          <span>TWITCH BROADCAST HUB</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-6xl font-bold font-display tracking-tight text-ctp-text">
              ~/подруб
            </h1>
            <p className="text-base text-ctp-subtext0 mt-2 max-w-2xl">
              Прямые трансляции на Twitch: кодинг на чистом вайбе, эксперименты с OBS и TUI, 
              починка упавших серверов и душевные разговоры за жизнь.
            </p>
          </div>

          <div>
            {loading ? (
              <span className="badge-offline aug-br">
                <span className="w-1.5 h-1.5 rounded-full bg-ctp-overlay0 animate-pulse" />
                <span>ОПРОС СЕРВЕРА...</span>
              </span>
            ) : status.isLive ? (
              <span className="badge-live aug-br">
                <span className="live-dot" />
                <span>В ЭФИРЕ ({status.viewerCount})</span>
              </span>
            ) : (
              <span className="badge-offline aug-br">
                <span className="w-1.5 h-1.5 rounded-full bg-ctp-overlay0" />
                <span>СТРИМ СПИТ</span>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          Stream Viewport / Player
          -------------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="panel-sharp aug-br overflow-hidden bg-black border border-[var(--border)]">
          {status.isLive ? (
            <div className="aspect-video w-full">
              <iframe
                src={`https://player.twitch.tv/?channel=${status.channel}&parent=${hostname}&autoplay=true&muted=false`}
                className="w-full h-full border-0"
                allowFullScreen
                title="Twitch Player"
              />
            </div>
          ) : (
            <div className="aspect-video w-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-card)] stripe-bg relative">
              <div className="max-w-md space-y-4 z-10">
                <div className="inline-block p-3 border border-[var(--border)] bg-ctp-surface0 aug-br font-mono text-2xl text-ctp-overlay0">
                  [ ○ OFFLINE ]
                </div>
                <h2 className="text-2xl font-bold font-display text-ctp-text">
                  Канал twitch.tv/{status.channel} сейчас отдыхает
                </h2>
                <p className="text-xs sm:text-sm text-ctp-subtext0">
                  Стрим выключен. Но трансляции случаются часто! Подписывайся на канал и Telegram, 
                  чтобы поймать уведомление о начале эфира.
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <a
                    href={status.channelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aug-br px-5 py-2.5 font-mono text-xs font-semibold bg-ctp-red text-white hover:opacity-90 transition-opacity"
                  >
                    Перейти на Twitch канал ↗
                  </a>
                  <a
                    href="https://t.me/Vokiry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aug-br px-4 py-2.5 font-mono text-xs font-semibold border border-[var(--border)] bg-ctp-surface0 text-ctp-sapphire hover:border-ctp-sapphire transition-colors"
                  >
                    Telegram с анонсами ↗
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Stream details bar */}
          <div className="p-4 bg-[var(--bg-card)] border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
            <div>
              <span className="text-ctp-overlay1">Текущий тайтл: </span>
              <span className="text-ctp-text font-semibold">{status.title}</span>
            </div>
            <div className="flex items-center gap-4 text-ctp-subtext0">
              <span>Категория: <strong className="text-ctp-mauve">{status.gameName}</strong></span>
              <span>Канал: <strong className="text-ctp-peach">{status.channel}</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          Commands & Rules Grid
          -------------------------------------------------------------------- */}
      <section className="grid md:grid-cols-2 gap-6">
        {/* Chat Commands */}
        <div className="panel-card aug-br p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] font-mono text-xs">
            <span className="text-ctp-mauve font-bold">// КОМАНДЫ ЧАТА</span>
            <span className="text-ctp-overlay0">[IRC_HELP]</span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {CHAT_COMMANDS.map((item) => (
              <div
                key={item.cmd}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] gap-1.5"
              >
                <code className="text-ctp-mauve font-bold">{item.cmd}</code>
                <span className="text-ctp-subtext0 text-[11px]">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stream Philosophy & Support */}
        <div className="panel-card aug-br p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] font-mono text-xs">
              <span className="text-ctp-peach font-bold">// ВАЙБ ЭФИРА</span>
              <span className="text-ctp-overlay0">[GUIDELINES]</span>
            </div>

            <div className="space-y-3 text-xs text-ctp-subtext0 leading-relaxed pt-2">
              <p>
                <strong className="text-ctp-text">1. Никакой духоты.</strong> Вайбкод превыше догм. 
                Если костыль работает и не роняет прод — значит, это фича.
              </p>
              <p>
                <strong className="text-ctp-text">2. Интерактив и код.</strong> В чате можно 
                предлагать свои безумные идеи, критиковать архитектуру и скидывать интересные репозитории.
              </p>
              <p>
                <strong className="text-ctp-text">3. Ламповость.</strong> Здесь все свои. 
                Уважаем собеседников, троллим по-доброму и кайфуем от процесса.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-subtle)] space-y-2">
            <div className="text-xs font-mono text-ctp-overlay1">
              // Поддержать медианищету на кофе и сервера:
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://www.donationalerts.com/r/vokiry"
                target="_blank"
                rel="noopener noreferrer"
                className="aug-br px-3 py-1.5 text-xs font-mono bg-ctp-peach/10 border border-ctp-peach/40 text-ctp-peach hover:bg-ctp-peach/20 transition-colors"
              >
                DonationAlerts ↗
              </a>
              <Link
                href="/hardware"
                className="aug-br px-3 py-1.5 text-xs font-mono border border-[var(--border)] text-ctp-subtext0 hover:border-ctp-teal hover:text-ctp-teal transition-colors"
              >
                Глянуть сетап медианищеты →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
