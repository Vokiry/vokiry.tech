import Link from "next/link";
import { getProfile } from "@/lib/profile";
import { siteConfig } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

export default function AboutPage() {
  const profile = getProfile();
  const about = profile?.about || {
    whoAmI: siteConfig.author.bio,
    whatIDo: "Разрабатываю веб-приложения, автоматизирую стримы на Python/OBS WebSocket, пилю скрипты и делюсь графоманией.",
  };
  const socials = { ...siteConfig.socials, ...profile.social };
  const twitchUrl = profile.social?.twitch || siteConfig.twitch.channelUrl;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* --------------------------------------------------------------------
          Header
          -------------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 font-mono text-xs text-ctp-subtext0">
          <span className="tui-chip aug-br text-ctp-mauve">[ ABOUT // КТО_Я ]</span>
          <span className="text-ctp-overlay0">//</span>
          <span>{siteConfig.author.handle}</span>
        </div>

        <div>
          <h1 className="text-4xl sm:text-6xl font-bold font-display tracking-tight text-ctp-text">
            Обо мне
          </h1>
          <p className="text-base text-ctp-subtext0 mt-2 max-w-xl">
            {siteConfig.author.role} // Личная станция и лаборатория
          </p>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          Cards
          -------------------------------------------------------------------- */}
      <div className="space-y-6">
        <section className="panel-card aug-br p-6 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)] font-mono text-xs">
            <span className="text-ctp-mauve font-bold">// КТО Я ТАКОЙ</span>
            <span className="text-ctp-overlay0">[IDENTITY]</span>
          </div>
          <p className="text-sm text-ctp-subtext0 leading-relaxed">
            {about.whoAmI}
          </p>
        </section>

        <section className="panel-card aug-br p-6 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)] font-mono text-xs">
            <span className="text-ctp-teal font-bold">// ЧЕМ ЗАНИМАЮСЬ</span>
            <span className="text-ctp-overlay0">[ACTIVITY]</span>
          </div>
          <p className="text-sm text-ctp-subtext0 leading-relaxed">
            {about.whatIDo}
          </p>
        </section>

        <section className="panel-card aug-br p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)] font-mono text-xs">
            <span className="text-ctp-peach font-bold">// СВЯЗЬ И КАНАЛЫ</span>
            <span className="text-ctp-overlay0">[CHANNELS]</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 font-mono text-xs">
            <a
              href={twitchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-ctp-red text-ctp-text flex items-center justify-between transition-colors"
            >
              <span>Twitch канал:</span>
              <span className="text-ctp-red font-semibold">{twitchUrl.replace("https://", "")} ↗</span>
            </a>
            <a
              href={socials.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-ctp-sapphire text-ctp-text flex items-center justify-between transition-colors"
            >
              <span>Telegram:</span>
              <span className="text-ctp-sapphire font-semibold">{socials.telegram.replace("https://t.me/", "@")} ↗</span>
            </a>
            <a
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-ctp-teal text-ctp-text flex items-center justify-between transition-colors"
            >
              <span>GitHub:</span>
              <span className="text-ctp-teal font-semibold">{socials.github.replace("https://github.com/", "")} ↗</span>
            </a>
            <a
              href={`mailto:${socials.email}`}
              className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-ctp-peach text-ctp-text flex items-center justify-between transition-colors"
            >
              <span>Email:</span>
              <span className="text-ctp-peach font-semibold">{socials.email} ↗</span>
            </a>
          </div>
        </section>
      </div>

      {/* Navigation footer */}
      <div className="pt-4 flex flex-wrap gap-4 font-mono text-xs">
        <Link href="/hardware" className="text-ctp-mauve hover:underline">
          → Посмотреть сетап медианищеты (~/железки)
        </Link>
        <Link href="/crafts" className="text-ctp-teal hover:underline">
          → Смотреть открытые проекты (~/костыли)
        </Link>
      </div>
    </div>
  );
}
