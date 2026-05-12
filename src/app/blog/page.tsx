import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <header className="animate-fade-in">
        <p className="text-[var(--section-accent)] font-mono text-sm mb-2">~/blog</p>
        <h1 className="text-5xl font-bold mb-4">
          <span className="neon-underline gradient-text">Writing</span>
        </h1>
        <p className="text-[var(--text-secondary)] font-mono text-sm">
          $ ls posts/ — {posts.length} entr{posts.length === 1 ? "y" : "ies"}
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-[var(--text-muted)] font-mono">
          No posts yet.{" "}
          <Link href="/admin" className="text-[var(--section-accent)] hover:underline">
            add via admin →
          </Link>
        </p>
      ) : (
        <ul className="prompt-list divide-y divide-[var(--border)]">
          {posts.map((post) => (
            <li key={post.slug} className="py-5">
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="flex items-baseline gap-4 mb-2 font-mono text-xs text-[var(--text-muted)]">
                  <time className="tabular-nums">{post.date}</time>
                  <span className="flex-1 border-t border-dotted border-[var(--border)]" />
                  <span>{post.tags.slice(0, 3).map((t) => `#${t}`).join(" ")}</span>
                </div>
                <h2 className="text-2xl font-bold mb-2 group-hover:text-[var(--section-accent)] transition-colors">
                  <span className="neon-underline">{post.title}</span>
                </h2>
                <p className="text-[var(--text-secondary)]">{post.excerpt}</p>
                <span className="inline-block mt-2 text-sm text-[var(--section-accent)] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  read →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
