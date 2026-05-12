import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { SplitPaneHero } from "@/components/SplitPaneHero";
import { getProjects } from "@/lib/projects";
import { getAllPosts } from "@/lib/posts";
import { getProfile } from "@/lib/profile";
import { getSkills } from "@/lib/skills";

export const dynamic = "force-dynamic";

export default function Home() {
  const projects = getProjects();
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  const posts = getAllPosts().slice(0, 3);
  const profile = getProfile();
  const stack = getSkills().flatMap((s) => s.items).slice(0, 6);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* HERO — split-pane IDE */}
      <section className="animate-fade-in">
        <div className="mb-6 flex items-baseline gap-3">
          <p className="text-[var(--section-accent)] font-mono text-sm flex items-center gap-2">
            <span className="animate-blink">❯</span>
            <span>hello.world</span>
          </p>
          <span className="text-[var(--text-muted)] text-xs font-mono">[esc]: nav</span>
        </div>
        <h1
          className="glitch-hover text-5xl sm:text-7xl font-bold mb-6 gradient-text inline-block cursor-default"
          data-text="vokiry"
        >
          vokiry
        </h1>
        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mb-10">
          Full-stack developer building tools and experiences. Terminal-flavored, monospace-pilled.
        </p>

        <SplitPaneHero
          whoAmI={profile?.about?.whoAmI || "I build developer utilities, share knowledge through writing, and create things that make life easier."}
          stack={stack.length > 0 ? stack : ["TypeScript", "Go", "Rust", "Next.js", "Postgres", "Linux"]}
        />

        <div className="flex flex-wrap gap-4 mt-8">
          <Link href="/portfolio" className="btn-primary inline-flex items-center gap-2 hover-lift">
            View Work
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
          <Link href="/about" className="btn-secondary inline-flex items-center gap-2">
            About Me
          </Link>
          <Link href="/blog" className="btn-secondary inline-flex items-center gap-2">
            Blog
          </Link>
        </div>
      </section>

      {/* Featured projects — magazine grid */}
      {featuredProjects.length > 0 && (
        <section className="animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[var(--section-accent)] font-mono text-sm mb-1">~/featured</p>
              <h2 className="text-3xl font-bold">
                <span className="neon-underline">Selected Work</span>
              </h2>
            </div>
            <Link href="/portfolio" className="text-[var(--section-accent)] hover:underline text-sm font-mono">
              all projects →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 md:grid-rows-2 gap-4 auto-rows-fr">
            {featuredProjects.map((project, i) => (
              <Link
                key={project.slug}
                href="/portfolio"
                className={`mag-card p-6 block group ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
              >
                <div className="flex items-center gap-2 mb-3 text-xs font-mono text-[var(--text-muted)]">
                  <span>[{String(i + 1).padStart(2, "0")}]</span>
                  <span>·</span>
                  <span>{project.tech[0]}</span>
                </div>
                <h3 className={`font-bold mb-3 group-hover:text-[var(--section-accent)] transition-colors ${i === 0 ? "text-3xl md:text-4xl" : "text-xl"}`}>
                  <span className="neon-underline">{project.title}</span>
                </h3>
                <p className={`text-[var(--text-secondary)] ${i === 0 ? "text-base" : "text-sm"} mb-4`}>
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.slice(0, i === 0 ? 6 : 3).map((t) => (
                    <span key={t} className="px-2 py-0.5 text-xs rounded bg-[var(--bg-card)] text-[var(--text-muted)] font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent posts */}
      <section className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[var(--section-accent)] font-mono text-sm mb-1">~/writes</p>
            <h2 className="text-3xl font-bold">
              <span className="neon-underline">Latest Posts</span>
            </h2>
          </div>
          <Link href="/blog" className="text-[var(--section-accent)] hover:underline text-sm font-mono">
            all posts →
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-[var(--text-muted)] font-mono">$ ls posts/ — empty.</p>
        ) : (
          <ul className="prompt-list space-y-3 font-mono">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="group flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 py-2 border-b border-[var(--border)] hover:border-[var(--section-accent)] transition-colors">
                  <time className="text-xs text-[var(--text-muted)] tabular-nums w-24">{post.date}</time>
                  <span className="text-lg group-hover:text-[var(--section-accent)] transition-colors flex-1">
                    {post.title}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {post.tags.slice(0, 2).join(" · ")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Quick utilities */}
      <section className="animate-slide-up" style={{ animationDelay: "0.25s" }}>
        <p className="text-[var(--section-accent)] font-mono text-sm mb-1">~/tools</p>
        <h2 className="text-3xl font-bold mb-8">
          <span className="neon-underline">Devtools</span>
        </h2>
        <Link href="/utilities" className="mag-card p-6 block group">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-sm text-[var(--text-muted)]">$ ls utilities/</span>
            <span className="text-[var(--section-accent)] text-sm font-mono group-hover:translate-x-1 transition-transform inline-block">→</span>
          </div>
          <p className="font-mono text-sm text-[var(--text-primary)]">
            json · base64 · url · hash · color · timestamp · cron · sql
          </p>
        </Link>
      </section>
    </div>
  );
}
