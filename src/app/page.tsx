import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { getProjects } from "@/lib/projects";
import { getAllPosts } from "@/lib/posts";
import { getProfile } from "@/lib/profile";

export const dynamic = "force-dynamic";

export default function Home() {
  const projects = getProjects();
  const featuredProjects = projects.filter(p => p.featured).slice(0, 2);
  const posts = getAllPosts();
  const profile = getProfile();
  const uses = profile?.uses || { software: [] };

  const utilities = [
    { name: "JSON Formatter", href: "/utilities" },
    { name: "Base64 Encoder", href: "/utilities" },
    { name: "Hash Generator", href: "/utilities" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="py-16 animate-fade-in">
        <div className="max-w-2xl">
          <p className="text-[var(--primary)] font-mono mb-4 text-sm">
            ❯ Hello, I am
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
          <div className="flex gap-4">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--primary)] text-[var(--bg-primary)] font-medium hover:bg-[var(--primary-dark)] transition-colors"
            >
              View Work
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
            >
              About Me
            </Link>
          </div>
        </div>
      </section>

      <section className="py-8 animate-fade-in" style={{ animationDelay: "0.05s" }}>
        <div className="code-block">
          <div className="flex items-center gap-2 mb-3 text-[var(--text-muted)] text-sm">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
            <span>vokiry@terminal</span>
          </div>
          <div className="font-mono text-xs text-[var(--text-primary)] leading-relaxed">
            <span className="text-[var(--primary)]">$</span> fastfetch<br/>
            <span className="text-[var(--accent-cyan)]">      /\\_/\\  </span><span className="text-[var(--text-muted)]">  vokiry</span><br/>
            <span className="text-[var(--accent-cyan)]">     =(o.o)=  </span><br/>
            <span className="text-[var(--accent-cyan)]">       )___)</span><br/>
            <span className="text-[var(--primary)]">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span><br/>
            <span className="text-[var(--text-muted)]">  user:</span>    vokiry<br/>
            <span className="text-[var(--text-muted)]">  species:</span> red_panda<br/>
            <span className="text-[var(--text-muted)]">  colors:</span>  teal, cyan, red<br/>
            <span className="text-[var(--text-muted)]">  shell:</span>   zsh<br/>
            <span className="text-[var(--text-muted)]">  term:</span>    iterm2<br/>
            <span className="text-[var(--text-muted)]">  editor:</span>  vscode<br/>
            <span className="text-[var(--primary)]">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
          </div>
        </div>
      </section>

      {featuredProjects.length > 0 && (
        <section className="py-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold">Featured Projects</h2>
            <Link href="/portfolio" className="text-[var(--primary)] hover:underline text-sm">
              View all →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {featuredProjects.map((project) => (
              <Link
                key={project.slug}
                href="/portfolio"
                className="glass-card p-6 block group"
              >
                <h3 className="text-lg font-semibold mb-2 group-hover:text-[var(--primary)] transition-colors">
                  {project.title}
                </h3>
                <p className="text-[var(--text-secondary)] text-sm mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 text-xs rounded bg-[var(--bg-secondary)] text-[var(--text-muted)]"
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

      <section className="py-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">Recent Posts</h2>
          <Link href="/blog" className="text-[var(--primary)] hover:underline text-sm">
            View all →
          </Link>
        </div>
        {posts.length === 0 ? (
          <div className="glass-card p-4">
            <p className="text-[var(--text-muted)]">No posts yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                href="/blog"
                className="glass-card p-4 block group"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium group-hover:text-[var(--primary)] transition-colors">
                    {post.title}
                  </h3>
                  <span className="text-sm text-[var(--text-muted)]">{post.date}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="py-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <h2 className="text-2xl font-semibold mb-8">Quick Utilities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {utilities.map((util) => (
            <Link
              key={util.name}
              href={util.href}
              className="glass-card p-4 text-center group hover:border-[var(--primary)]"
            >
              <span className="text-[var(--text-secondary)] group-hover:text-[var(--primary)] transition-colors">
                {util.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}