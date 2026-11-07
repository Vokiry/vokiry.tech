import Link from "next/link";
import { getProjects } from "@/lib/projects";
import { getAllPosts } from "@/lib/posts";
import { LiveStreamWidget } from "@/components/LiveStreamWidget";

export const dynamic = "force-dynamic";

export default function Home() {
  const projects = getProjects();
  const featuredProjects = projects.filter((p) => p.featured || p.order <= 3).slice(0, 3);
  const posts = getAllPosts().slice(0, 3);

  const sections = [
    {
      code: "02",
      href: "/live",
      title: "~/подруб",
      subtitle: "Twitch стрим и статус",
      desc: "Эфир на twitch.tv/vokiry, расписание, клипы, команды чата и донаты.",
      accent: "text-ctp-red",
      border: "hover:border-ctp-red/50",
    },
    {
      code: "03",
      href: "/crafts",
      title: "~/костыли",
      subtitle: "Проекты и вайбкод",
      desc: "OBS-шаблоны, кастомные оверлеи, скрипты на коленке, телеграм-боты и опенсорс.",
      accent: "text-ctp-mauve",
      border: "hover:border-ctp-mauve/50",
    },
    {
      code: "04",
      href: "/hardware",
      title: "~/железки",
      subtitle: "Сетап медианищеты",
      desc: "Честный разбор рабочего ПК, мониторов, микрофона, камеры и софта.",
      accent: "text-ctp-teal",
      border: "hover:border-ctp-teal/50",
    },
    {
      code: "05",
      href: "/notes",
      title: "~/графомания",
      subtitle: "Мысли и заметки",
      desc: "Статьи про разработку, грабли в Linux/Next.js, стриминг и автоматизацию.",
      accent: "text-ctp-peach",
      border: "hover:border-ctp-peach/50",
    },
    {
      code: "06",
      href: "/wall",
      title: "~/забор",
      subtitle: "Гостевая чат-стена",
      desc: "Оставить памятную надпись на стене станции через GitHub.",
      accent: "text-ctp-sapphire",
      border: "hover:border-ctp-sapphire/50",
    },
    {
      code: "07",
      href: "/tools",
      title: "~/верстак",
      subtitle: "Микро-утилиты",
      desc: "Быстрый JSON, Base64, Cron, Color и хеширование без рекламы.",
      accent: "text-ctp-green",
      border: "hover:border-ctp-green/50",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
      {/* --------------------------------------------------------------------
          HERO — Station Header
          -------------------------------------------------------------------- */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-ctp-subtext0">
          <span className="tui-chip aug-br text-ctp-mauve">
            [ STATION_ID: VOKIRY-01 ]
          </span>
          <span className="text-ctp-overlay0">//</span>
          <span>MODE: VIBE_CODING</span>
          <span className="text-ctp-overlay0">//</span>
          <span className="text-ctp-green">STATION: OPERATIONAL</span>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="text-5xl sm:text-7xl font-bold font-display tracking-tight text-ctp-text">
              vokiry
            </h1>
            <span className="aug-br px-3 py-1 font-mono text-xs sm:text-sm bg-ctp-surface0 border border-ctp-mauve/40 text-ctp-mauve font-semibold">
              дурной вайбкодер × медианищета
            </span>
          </div>

          <p className="text-base sm:text-lg text-ctp-subtext0 max-w-3xl leading-relaxed">
            Пишу код на чистом вайбе, стримлю эксперименты на Twitch, собираю оверлеи и софт из костылей и энтузиазма. 
            Здесь собраны мои поделки, сетап медианищеты, трансляции и заметки с полей.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="https://twitch.tv/vokiry"
            target="_blank"
            rel="noopener noreferrer"
            className="aug-br inline-flex items-center gap-2 px-4 py-2 font-mono text-xs font-semibold bg-ctp-red text-white hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
          >
            <span>▶ Twitch подруб</span>
          </a>
          <Link
            href="/crafts"
            className="aug-br inline-flex items-center gap-1.5 px-4 py-2 font-mono text-xs font-semibold bg-ctp-surface0 border border-[var(--border)] text-ctp-text hover:border-ctp-mauve hover:text-ctp-mauve transition-all"
          >
            <span>[~/костыли]</span>
          </Link>
          <Link
            href="/hardware"
            className="aug-br inline-flex items-center gap-1.5 px-4 py-2 font-mono text-xs font-semibold bg-ctp-surface0 border border-[var(--border)] text-ctp-text hover:border-ctp-teal hover:text-ctp-teal transition-all"
          >
            <span>[~/железки]</span>
          </Link>
          <Link
            href="/wall"
            className="aug-br inline-flex items-center gap-1.5 px-4 py-2 font-mono text-xs font-semibold bg-ctp-surface0 border border-[var(--border)] text-ctp-text hover:border-ctp-peach hover:text-ctp-peach transition-all"
          >
            <span>[~/забор]</span>
          </Link>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          TWITCH BROADCAST FEED WIDGET
          -------------------------------------------------------------------- */}
      <section>
        <LiveStreamWidget />
      </section>

      {/* --------------------------------------------------------------------
          STATION BENTO NAVIGATION GRID
          -------------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)] font-mono text-xs">
          <span className="text-ctp-subtext0">// КАРТА СТАНЦИИ</span>
          <span className="text-ctp-overlay0">INDEX [02..07]</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((sec) => (
            <Link
              key={sec.code}
              href={sec.href}
              className={`panel-card aug-br p-5 block group ${sec.border} transition-all`}
            >
              <div className="flex items-center justify-between mb-3 text-xs font-mono">
                <span className="text-ctp-overlay0">[{sec.code}]</span>
                <span className={`${sec.accent} font-semibold group-hover:translate-x-1 transition-transform inline-block`}>
                  открыть ↗
                </span>
              </div>
              <h2 className="text-lg font-bold font-display text-ctp-text group-hover:text-ctp-mauve transition-colors mb-1">
                {sec.title}
              </h2>
              <div className="text-xs font-mono text-ctp-subtext0 mb-2">
                {sec.subtitle}
              </div>
              <p className="text-xs text-ctp-overlay1 leading-relaxed">
                {sec.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------------
          FEATURED CRAFTS (ПОДЕЛКИ И КОСТЫЛИ)
          -------------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
          <div>
            <span className="text-xs font-mono text-ctp-mauve">// ИЗБРАННЫЕ ПОДЕЛКИ</span>
            <h2 className="text-2xl font-bold font-display text-ctp-text mt-0.5">
              Свежие костыли
            </h2>
          </div>
          <Link
            href="/crafts"
            className="text-xs font-mono text-ctp-mauve hover:underline"
          >
            все костыли →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {featuredProjects.map((p, i) => (
            <div
              key={p.slug || i}
              className="panel-card aug-br p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-ctp-overlay0 mb-2">
                  <span>CRAFT #{String(i + 1).padStart(2, "0")}</span>
                  {p.live && <span className="text-ctp-green font-mono">● LIVE</span>}
                </div>
                <h3 className="text-lg font-bold font-display text-ctp-text mb-2">
                  {p.title}
                </h3>
                <p className="text-xs text-ctp-subtext0 mb-4 line-clamp-3 leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-[var(--border-subtle)]">
                <div className="flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 text-[11px] font-mono bg-ctp-surface1 text-ctp-subtext0"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-1 text-xs font-mono">
                  {p.github && p.github !== "#" && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ctp-mauve hover:underline"
                    >
                      GitHub ↗
                    </a>
                  )}
                  {p.live && p.live !== "#" && (
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ctp-teal hover:underline"
                    >
                      Демо ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------------
          RECENT NOTES (ГРАФОМАНИЯ)
          -------------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
          <div>
            <span className="text-xs font-mono text-ctp-peach">// БОРТОВОЙ ЖУРНАЛ</span>
            <h2 className="text-2xl font-bold font-display text-ctp-text mt-0.5">
              Свежая графомания
            </h2>
          </div>
          <Link
            href="/notes"
            className="text-xs font-mono text-ctp-peach hover:underline"
          >
            все заметки →
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="panel-sharp aug-br p-6 font-mono text-xs text-ctp-overlay1">
            <span>$ ls notes/ — пока пусто. Автор занят стримом или кодит костыли.</span>
          </div>
        ) : (
          <div className="space-y-2">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/notes/${post.slug}`}
                className="panel-sharp aug-br p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group block"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                  <span className="font-mono text-xs text-ctp-overlay0 tabular-nums">
                    {post.date}
                  </span>
                  <span className="text-base font-semibold text-ctp-text group-hover:text-ctp-mauve transition-colors">
                    {post.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-mono text-ctp-subtext0 px-2 py-0.5 bg-ctp-surface0"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
