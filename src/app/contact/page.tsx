import Link from "next/link";
import { getProfile } from "@/lib/profile";
import { siteConfig } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

export default function ContactPage() {
  const profile = getProfile();
  const socials = { ...siteConfig.socials, ...profile.social };
  const twitchUrl = profile.social?.twitch || siteConfig.twitch.channelUrl;

  const contacts = [
    {
      label: "Telegram",
      value: socials.telegram.replace("https://t.me/", "@"),
      href: socials.telegram,
      desc: "Самый быстрый способ связаться, написать фидбек или предложить идею",
      color: "text-ctp-sapphire",
      hoverBorder: "hover:border-ctp-sapphire",
    },
    {
      label: "Twitch",
      value: twitchUrl.replace("https://", ""),
      href: twitchUrl,
      desc: "Написать в чат прямо во время прямого эфира",
      color: "text-ctp-red",
      hoverBorder: "hover:border-ctp-red",
    },
    {
      label: "GitHub",
      value: socials.github.replace("https://github.com/", ""),
      href: socials.github,
      desc: "Форки, ишью, пулл-реквесты и контрибьюции в костыли",
      color: "text-ctp-teal",
      hoverBorder: "hover:border-ctp-teal",
    },
    {
      label: "Email",
      value: socials.email,
      href: `mailto:${socials.email}`,
      desc: "Для серьезных предложений, если телеграм недоступен",
      color: "text-ctp-peach",
      hoverBorder: "hover:border-ctp-peach",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* --------------------------------------------------------------------
          Header
          -------------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 font-mono text-xs text-ctp-subtext0">
          <span className="tui-chip aug-br text-ctp-peach">[ CONTACT // СВЯЗЬ ]</span>
          <span className="text-ctp-overlay0">//</span>
          <span>COMMUNICATION CHANNELS</span>
        </div>

        <div>
          <h1 className="text-4xl sm:text-6xl font-bold font-display tracking-tight text-ctp-text">
            Контакты
          </h1>
          <p className="text-base text-ctp-subtext0 mt-2 max-w-xl">
            Каналы связи с автором. Открыт к общению, предложениям совместных стримов и коллабораций.
          </p>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          Contacts Grid
          -------------------------------------------------------------------- */}
      <div className="grid sm:grid-cols-2 gap-4">
        {contacts.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className={`panel-card aug-br p-5 block group ${c.hoverBorder} transition-all`}
          >
            <div className="flex items-center justify-between font-mono text-xs mb-2">
              <span className="text-ctp-overlay0">[{c.label}]</span>
              <span className={`${c.color} font-semibold group-hover:translate-x-1 transition-transform inline-block`}>
                открыть ↗
              </span>
            </div>
            <div className={`font-mono text-base font-bold text-ctp-text group-hover:${c.color} transition-colors mb-1.5`}>
              {c.value}
            </div>
            <p className="text-xs text-ctp-subtext0 leading-relaxed">
              {c.desc}
            </p>
          </a>
        ))}
      </div>

      {/* Public alternative */}
      <section className="panel-sharp aug-br p-6 stripe-bg border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="font-mono text-xs text-ctp-sapphire font-bold">// ПУБЛИЧНАЯ СТЕНА</div>
          <p className="text-xs sm:text-sm text-ctp-text mt-0.5">
            Хотите оставить публичный след или передать привет со стрима?
          </p>
        </div>
        <Link
          href="/wall"
          className="aug-br px-4 py-2 font-mono text-xs font-semibold bg-ctp-mauve text-ctp-base hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Черкануть на заборе →
        </Link>
      </section>
    </div>
  );
}
