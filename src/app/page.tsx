import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { TerminalWindow } from "@/components/TerminalWindow";
import { getProjects } from "@/lib/projects";
import { getAllPosts } from "@/lib/posts";
import { getProfile } from "@/lib/profile";

export const dynamic = "force-dynamic";

export default function Home() {
  const projects = getProjects();
  const featuredProjects = projects.filter(p => p.featured).slice(0, 2);
  const posts = getAllPosts();
  const profile = getProfile();

  const utilities = [
    { name: "JSON Formatter", href: "/utilities" },
    { name: "Base64 Encoder", href: "/utilities" },
    { name: "Hash Generator", href: "/utilities" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="py-16 animate-fade-in">
        <div className="max-w-2xl">
          <p className="text-[var(--section-accent)] font-mono mb-4 text-sm flex items-center gap-2">
            <span className="animate-blink">❯</span>
            <span>Hello, I am</span>
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">vokiry</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] mb-6">
            Full-stack developer building tools and experiences
          </p>
          <p className="text-[var(--text-muted)] mb-8 max-w-lg">
            {profile?.about?.whoAmI || "I build developer utilities, share knowledge through writing, and create things that make life easier."}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/portfolio"
              className="btn-primary inline-flex items-center gap-2 hover-lift"
            >
              View Work
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="btn-secondary inline-flex items-center gap-2"
            >
              About Me
            </Link>
          </div>
        </div>
      </section>

      {/* Terminal ASCII Art */}
      <section className="py-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <TerminalWindow title="~ vokiry@terminal">
          <div className="font-mono text-xs text-[var(--text-primary)] leading-relaxed">
            <span className="text-[var(--section-accent)]">$</span> fastfetch<br/>
            <span className="text-[var(--accent-cyan)]">      /\\_/\\  </span><span className="text-[var(--text-muted)]">  vokiry</span><br/>
            <span className="text-[var(--accent-cyan)]">     =(o.o)=  </span><br/>
            <span className="text-[var(--accent-cyan)]">       )___)</span><br/>
            <span className="text-[var(--section-accent)]">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span><br/>
            <span className="text-[var(--text-muted)]">  user:</span>    vokiry<br/>
            <span className="text-[var(--text-muted)]">  species:</span> red_panda<br/>
            <span className="text-[var(--text-muted)]">  colors:</span>  teal, cyan, red<br/>
            <span className="text-[var(--section-accent)]">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
          </div>
        </TerminalWindow>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-8 animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Featured Projects</h2>
            <Link href="/portfolio" className="text-[var(--section-accent)] hover:underline text-sm">
              View all →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 stagger-2">
            {featuredProjects.map((project) => (
              <Link
                key={project.slug}
                href="/portfolio"
                className="terminal-card p-6 block group"
              >
                <h3 className="text-lg font-semibold mb-2 group-hover:text-[var(--section-accent)] transition-colors">
                  {project.title}
                </h3>
                <p className="text-[var(--text-secondary)] text-sm mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 text-xs rounded bg-[var(--bg-card)] text-[var(--text-muted)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="py-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Recent Posts</h2>
          <Link href="/blog" className="text-[var(--section-accent)] hover:underline text-sm">
            View all →
          </Link>
        </div>
        {posts.length === 0 ? (
          <TerminalWindow variant="minimal">
            <p className="text-[var(--text-muted)]">No posts yet. Start writing!</p>
          </TerminalWindow>
        ) : (
          <div className="space-y-3 stagger-3">
            {posts.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="terminal-card p-4 block group"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium group-hover:text-[var(--section-accent)] transition-colors">
                    {post.title}
                  </h3>
                  <span className="text-sm text-[var(--text-muted)]">{post.date}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Quick Utilities */}
      <section className="py-8 animate-slide-up" style={{ animationDelay: "0.25s" }}>
        <h2 className="text-2xl font-semibold mb-6">Quick Utilities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 stagger-4">
          {utilities.map((util) => (
            <Link
              key={util.name}
              href={util.href}
              className="terminal-card p-4 text-center group hover-scale"
            >
              <span className="text-[var(--text-secondary)] group-hover:text-[var(--section-accent)] transition-colors">
                {util.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}