"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Entry {
  id: string;
  name: string;
  message: string;
  date: string;
}

export default function GuestbookPage() {
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
        body: JSON.stringify({ name, message }),
      });
      if (res.ok) {
        const newEntry = await res.json();
        setEntries([newEntry, ...entries]);
        setName("");
        setMessage("");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2 gradient-text">/guestbook</h1>
      <p className="text-[var(--text-secondary)] mb-8">
        Leave a message for future visitors.
      </p>

      <div className="code-block mb-8">
        <div className="flex items-center gap-2 mb-3 text-[var(--text-muted)] text-sm">
          <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
          <span>vokiry@terminal</span>
        </div>
        <pre className="text-xs sm:text-sm font-mono text-[var(--text-primary)]">
<span className="text-[var(--primary)]">$</span> cat guestbook.txt
<span className="text-[var(--text-muted)]"># Welcome! Sign below to leave your mark.</span></pre>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 mb-8">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
              Name (optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-md bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
              placeholder="Your name"
            />
          </div>
          <div className="flex items-end">
            <span className="text-sm text-[var(--text-muted)]">
              {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-32 p-3 rounded-md bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none transition-colors resize-none"
            placeholder="Write your message..."
            required
          />
        </div>
        <button
          type="submit"
          disabled={submitting || !message.trim()}
          className="px-6 py-3 rounded-md bg-[var(--primary)] text-[var(--bg-primary)] font-medium hover:bg-[var(--primary-dark)] transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          {submitting ? "Signing..." : "Sign Guestbook"}
        </button>
        {success && (
          <span className="ml-4 text-[var(--accent-green)] text-sm">
            ✓ Signed successfully!
          </span>
        )}
      </form>

      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold">Messages ({entries.length})</h2>
        <div className="flex-1 h-px bg-[var(--border)]"></div>
      </div>

      {loading ? (
        <p className="text-[var(--text-muted)]">Loading messages...</p>
      ) : entries.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <p className="text-[var(--text-muted)]">No messages yet. Be the first to sign!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry, idx) => (
            <div
              key={entry.id}
              className="glass-card p-5 animate-fade-in"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-[var(--primary)]">{entry.name}</span>
                <span className="text-sm text-[var(--text-muted)]">{entry.date}</span>
              </div>
              <p className="text-[var(--text-secondary)] whitespace-pre-wrap">{entry.message}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link href="/" className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}