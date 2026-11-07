import Link from "next/link";
import { getNowItems } from "@/lib/profile";

export const dynamic = "force-dynamic";

export default function NowPage() {
  const nowItems = getNowItems();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* --------------------------------------------------------------------
          Header
          -------------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 font-mono text-xs text-ctp-subtext0">
          <span className="tui-chip aug-br text-ctp-teal">[ NOW // СЕЙЧАС ]</span>
          <span className="text-ctp-overlay0">//</span>
          <span>CURRENT FOCUS &amp; ACTIVITIES</span>
        </div>

        <div>
          <h1 className="text-4xl sm:text-6xl font-bold font-display tracking-tight text-ctp-text">
            ~/сейчас
          </h1>
          <p className="text-base text-ctp-subtext0 mt-2 max-w-xl">
            Страница в духе концепции /now Дерека Сиверса. Чем заняты руки и голова прямо в эти дни.
          </p>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          Now items
          -------------------------------------------------------------------- */}
      <div className="space-y-4">
        {nowItems.length === 0 ? (
          <div className="panel-sharp aug-br p-6 text-center font-mono text-xs text-ctp-subtext0">
            [ Текущий фокус пока пуст. Автор кодит костыли на стриме. ]
          </div>
        ) : (
          nowItems.map((item, idx) => (
            <div
              key={idx}
              className="panel-card aug-br p-6 space-y-2 hover:border-ctp-teal/50 transition-all"
            >
              <div className="flex items-center gap-2 font-mono text-xs text-ctp-teal">
                <span>[0{idx + 1}]</span>
                <span className="font-bold text-ctp-text text-base">{item.item}</span>
              </div>
              <p className="text-xs sm:text-sm text-ctp-subtext0 leading-relaxed font-mono pl-6">
                {item.description}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Footer links */}
      <div className="pt-4 flex flex-wrap gap-4 font-mono text-xs">
        <Link href="/hardware" className="text-ctp-teal hover:underline">
          → Железки сетапа (~/железки)
        </Link>
        <Link href="/live" className="text-ctp-red hover:underline">
          → Проверить подруб (~/подруб)
        </Link>
        <Link href="/tails" className="text-ctp-mauve hover:underline">
          → Easter egg (~/tails)
        </Link>
      </div>
    </div>
  );
}
