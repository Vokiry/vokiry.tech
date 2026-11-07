import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full panel-sharp aug-br p-6 sm:p-8 space-y-6 bg-[var(--bg-secondary)] border border-[var(--border)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-ctp-red animate-ping" />
            <span className="text-ctp-red font-bold">[ 404 // SIGNAL_LOST ]</span>
          </div>
          <span className="text-ctp-overlay0">{siteConfig.stationId}</span>
        </div>

        {/* Message */}
        <div className="space-y-3 font-mono">
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-ctp-text">
            Маршрут не найден в эфире
          </h1>
          <p className="text-xs sm:text-sm text-ctp-subtext0 leading-relaxed">
            Запрошенный сектор отсутствует на сервере. Возможно, файл переименован во время 
            ночного вайбкодинга или ссылка устарела.
          </p>
        </div>

        {/* Suggested routes */}
        <div className="p-4 bg-ctp-surface0 border border-[var(--border-subtle)] aug-br space-y-2 font-mono text-xs">
          <div className="text-ctp-overlay1">// ДОСТУПНЫЕ СЕКТОРЫ СТАНЦИИ:</div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-ctp-mauve hover:underline"
              >
                [{item.code}] {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-wrap gap-3">
          <Link
            href="/"
            className="aug-br px-5 py-2 font-mono text-xs font-semibold bg-ctp-mauve text-ctp-base hover:opacity-90 transition-opacity"
          >
            ← Вернуться на базу
          </Link>
          <Link
            href="/live"
            className="aug-br px-4 py-2 font-mono text-xs font-semibold border border-[var(--border)] text-ctp-subtext0 hover:border-ctp-red hover:text-ctp-red transition-colors"
          >
            Проверить подруб ↗
          </Link>
        </div>
      </div>
    </div>
  );
}
