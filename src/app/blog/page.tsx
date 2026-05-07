import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default function BlogPage() {
  const posts = getAllPosts();

  const samplePosts = [
    {
      title: "Getting Started with Next.js 14",
      date: "2024-01-15",
      excerpt: "Exploring the new features in Next.js 14 and how to get started with App Router.",
      tags: ["Next.js", "React", "Tutorial"],
      slug: "getting-started-nextjs-14",
    },
    {
      title: "Building Developer Tools",
      date: "2024-01-10",
      excerpt: "Thoughts on what makes a good developer tool and lessons learned building utilities.",
      tags: ["DevTools", "UX"],
      slug: "building-developer-tools",
    },
    {
      title: "Welcome to My Blog",
      date: "2024-01-01",
      excerpt: "Starting a new journey in writing about development and sharing knowledge.",
      tags: ["Introduction"],
      slug: "welcome-to-my-blog",
    },
  ];

  const displayPosts = posts.length > 0 ? posts : samplePosts;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 gradient-text">Blog</h1>

      {posts.length === 0 && (
        <div className="mb-6 p-4 rounded bg-[var(--bg-secondary)] border border-[var(--border)]">
          <p className="text-sm text-[var(--text-muted)]">
            No posts yet.{" "}
            <Link href="/admin" className="text-[var(--primary)] hover:underline">
              Add posts via admin →
            </Link>
          </p>
        </div>
      )}

      <div className="space-y-6">
        {displayPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <article className="glass-card p-6 hover:border-[var(--primary)] cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <time className="text-sm text-[var(--text-muted)]">{post.date}</time>
                <span className="text-[var(--text-muted)]">·</span>
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)]"
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