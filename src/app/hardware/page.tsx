import { getHardware } from "@/lib/profile";
import Link from "next/link";

export default function HardwarePage() {
  const hardware = getHardware();

  const sections = [
    {
      code: "01",
      title: "Пекарня & Машины",
      desc: "На чём компилируются костыли и рендерится трансляция",
      accent: "text-ctp-mauve",
      border: "border-ctp-mauve/40",
      items: hardware.computer,
    },
    {
      code: "02",
      title: "Периферия & Экраны",
      desc: "Органы ввода и экраны для ловли багов и сообщений чата",
      accent: "text-ctp-teal",
      border: "border-ctp-teal/40",
      items: hardware.peripherals,
    },
    {
      code: "03",
      title: "Стрим-стек медианищеты",
      desc: "Звук, картинка и свет, собранные с душой и самоиронией",
      accent: "text-ctp-peach",
      border: "border-ctp-peach/40",
      items: hardware.streaming,
    },
    {
      code: "04",
      title: "Софт & Дев-окружение",
      desc: "Терминал, шрифты, редакторы и цветовая схема Catppuccin",
      accent: "text-ctp-sapphire",
      border: "border-ctp-sapphire/40",
      items: hardware.software,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* --------------------------------------------------------------------
          Header
          -------------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 font-mono text-xs text-ctp-subtext0">
          <span className="tui-chip aug-br text-ctp-teal">[ 04 // ЖЕЛЕЗКИ ]</span>
          <span className="text-ctp-overlay0">//</span>
          <span>HARDWARE RIG &amp; ENVIRONMENT</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-6xl font-bold font-display tracking-tight text-ctp-text">
              ~/железки
            </h1>
            <p className="text-base text-ctp-subtext0 mt-2 max-w-2xl leading-relaxed">
              Честный разбор оборудования, периферии и софта медианищеты. Без пафоса и спонсорских 
              интеграций: только то, на чём реально пишется вайбкод и держится стрим.
            </p>
          </div>

          <div className="font-mono text-xs text-ctp-overlay1">
            <span>STATUS: CALIBRATED // 2026</span>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          Hardware Categories
          -------------------------------------------------------------------- */}
      <section className="space-y-8">
        {sections.map((sec) => (
          <div key={sec.code} className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)] font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-ctp-overlay0">[{sec.code}]</span>
                <span className={`${sec.accent} font-bold`}>{sec.title}</span>
                <span className="text-ctp-overlay1 hidden sm:inline">— {sec.desc}</span>
              </div>
              <span className="text-ctp-overlay0">{sec.items.length} units</span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sec.items.map((item, i) => (
                <div
                  key={item.name + i}
                  className="panel-card aug-br p-5 flex flex-col justify-between hover:border-ctp-mauve/50 transition-all"
                >
                  <div className="space-y-2">
                    <div className="text-[11px] font-mono text-ctp-overlay0 uppercase tracking-wider">
                      {item.name}
                    </div>
                    <div className="text-base font-bold font-display text-ctp-text">
                      {item.spec}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--border-subtle)]">
                    <p className="text-xs text-ctp-subtext0 italic">
                      &laquo;{item.note}&raquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* --------------------------------------------------------------------
          Philosophy / Callout Box
          -------------------------------------------------------------------- */}
      <section className="panel-sharp aug-br p-6 stripe-bg border border-[var(--border)] space-y-3">
        <div className="font-mono text-xs text-ctp-teal font-bold">
          // МАНИФЕСТ МЕДИАНИЩЕТЫ
        </div>
        <p className="text-xs sm:text-sm text-ctp-text leading-relaxed max-w-3xl">
          Крутой контент и работающий софт делаются не топовыми картами захвата за 1000$ и не золотыми микрофонами. 
          Главное — идея, вайб и нормальная настройка звука с гейтом и компрессором. 
          Если у тебя слабый ПК — оптимизируй скрипты, юзай TUI и пиши чистый код.
        </p>
        <div className="pt-2 flex items-center gap-4 text-xs font-mono">
          <Link href="/live" className="text-ctp-mauve hover:underline font-semibold">
            Посмотреть сетап в деле на стриме →
          </Link>
          <Link href="/crafts" className="text-ctp-teal hover:underline font-semibold">
            Глянуть OBS-Templates в костылях →
          </Link>
        </div>
      </section>
    </div>
  );
}
