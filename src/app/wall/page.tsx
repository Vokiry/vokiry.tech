"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Entry {
  id: string;
  name: string;
  message: string;
  date: string;
}

export default function WallPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/guestbook")
      .then((res) => res.json())
      .then((data) => {
        setEntries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() || "Анонимный зритель", message: message.trim() }),
      });
      if (res.ok) {
        const newEntry = await res.json();
        setEntries([newEntry, ...entries]);
        setName("");
        setMessage("");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      }
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* --------------------------------------------------------------------
          Header
          -------------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 font-mono text-xs text-ctp-subtext0">
          <span className="tui-chip aug-br text-ctp-sapphire">[ 06 // ЗАБОР ]</span>
          <span className="text-ctp-overlay0">//</span>
          <span>PUBLIC GRAFFITI WALL &amp; CHAT LOG</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-6xl font-bold font-display tracking-tight text-ctp-text">
              ~/забор
            </h1>
            <p className="text-base text-ctp-subtext0 mt-2 max-w-xl leading-relaxed">
              Настенный лог станции. Черкни привет со стрима, передай респект, 
              поругай костыли или оставь ссылку на свой репозиторий.
            </p>
          </div>

          <div className="font-mono text-xs text-ctp-overlay1">
            <span>НАДПИСЕЙ: {entries.length} // ALL_PUBLIC</span>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          Input Form
          -------------------------------------------------------------------- */}
      <section>
        <form onSubmit={handleSubmit} className="panel-card aug-br p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] font-mono text-xs">
            <span className="text-ctp-sapphire font-bold">// ОСТАВИТЬ НАДПИСЬ НА ЗАБОРЕ</span>
            <span className="text-ctp-overlay0">[NEW_ENTRY]</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-ctp-subtext0 mb-1.5">
                Никнейм или позывной:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-[var(--bg-secondary)] border border-[var(--border)] text-ctp-text focus:border-ctp-mauve focus:outline-none transition-colors"
                placeholder="Анонимный зритель"
              />
            </div>

            <div className="flex items-end text-xs font-mono text-ctp-overlay1">
              <span>Дата: {new Date().toISOString().split("T")[0]}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-ctp-subtext0 mb-1.5">
              Сообщение на стену:
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-24 px-3 py-2 text-xs font-mono bg-[var(--bg-secondary)] border border-[var(--border)] text-ctp-text focus:border-ctp-mauve focus:outline-none transition-colors resize-none"
              placeholder="Привет со стрима! Сайт огонь, костыли работают..."
              required
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              disabled={submitting || !message.trim()}
              className="aug-br px-5 py-2 font-mono text-xs font-semibold bg-ctp-mauve text-ctp-base hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
            >
              {submitting ? "Красим забор..." : "[ ЧЕРКАНУТЬ НА ЗАБОРЕ ]"}
            </button>

            {success && (
              <span className="font-mono text-xs text-ctp-green animate-pulse">
                ✓ Надпись выбита на заборе!
              </span>
            )}
          </div>
        </form>
      </section>

      {/* --------------------------------------------------------------------
          Messages Wall
          -------------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)] font-mono text-xs">
          <span className="text-ctp-subtext0">// ХРОНИКА ЗАБОРА</span>
          <span className="text-ctp-overlay0">LOG_ENTRIES</span>
        </div>

        {loading ? (
          <div className="panel-sharp aug-br p-6 text-center font-mono text-xs text-ctp-subtext0">
            [ Считываем надписи с забора... ]
          </div>
        ) : entries.length === 0 ? (
          <div className="panel-sharp aug-br p-6 text-center font-mono text-xs text-ctp-subtext0">
            [ Забор девственно чист. Будь первым, кто черканёт пару строк! ]
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="panel-card aug-br p-4 sm:p-5 space-y-2 hover:border-ctp-sapphire/40 transition-all"
              >
                <div className="flex items-center justify-between font-mono text-xs text-ctp-overlay0">
                  <div className="flex items-center gap-2">
                    <span className="text-ctp-mauve font-bold">&gt;</span>
                    <span className="text-ctp-text font-semibold">{entry.name}</span>
                  </div>
                  <span className="tabular-nums text-[11px]">{entry.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-ctp-subtext0 whitespace-pre-wrap font-mono pl-4 border-l border-[var(--border-subtle)]">
                  {entry.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
