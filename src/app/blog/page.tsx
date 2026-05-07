import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { TerminalWindow } from "@/components/TerminalWindow";

export const dynamic = "force-dynamic";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 gradient-text">/blog</h1>

      {/* Terminal Header */}
      <div className="mb-8 animate-scale-in">
        <TerminalWindow title="~ blog">
          <pre className="text-[var(--text-primary)] font-mono text-sm">
<span className="text-[var(--section-accent)]">$</span> ls -la posts/
total {posts.length}
drwxr-xr-x  {posts.length}  {new Date().toLocaleDateString()}
.</pre>
        </TerminalWindow>
      </div>

      {posts.length === 0 && (
        <div className="mb-6 animate-fade-in">
          <TerminalWindow variant="minimal">
            <p className="text-[var(--text-muted)]">
              No posts yet.{" "}
              <Link href="/admin" className="text-[var(--section-accent)] hover:underline">
                Add posts via admin →
              </Link>
            </p>
          </TerminalWindow>
        </div>
      )}

      <div className="space-y-4 stagger-2">
        {posts.map((post, index) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <article className="terminal-card p-5 hover-lift cursor-pointer animate-slide-up" style={{ animationDelay: `${(index + 1) * 0.05}s` }}>
              <div className="flex items-center gap-3 mb-3">
                <time className="text-sm text-[var(--text-muted)]">{post.date}</time>
                <span className="text-[var(--text-muted)]">·</span>
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded bg-[var(--bg-card)] text-[var(--section-accent)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-[var(--text-secondary)]">{post.excerpt}</p>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}