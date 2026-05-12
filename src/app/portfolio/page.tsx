import { getProjects } from "@/lib/projects";
import { getSkills } from "@/lib/skills";

export const dynamic = "force-dynamic";

export default function PortfolioPage() {
  const projects = getProjects();
  const skills = getSkills();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <header className="animate-fade-in">
        <p className="text-[var(--section-accent)] font-mono text-sm mb-2">~/portfolio</p>
        <h1 className="text-5xl font-bold mb-4">
          <span className="neon-underline gradient-text">Work & Projects</span>
        </h1>
        <p className="text-[var(--text-secondary)] max-w-2xl">
          {projects.length} project{projects.length === 1 ? "" : "s"}. Click any card to explore links.
        </p>
      </header>

      {/* Projects */}
      <section className="animate-slide-up">
        {projects.length === 0 ? (
          <p className="text-[var(--text-muted)] font-mono">$ ls projects/ — empty.</p>
        ) : (
          <div className="grid md:grid-cols-6 gap-4 auto-rows-[minmax(200px,auto)]">
            {projects.map((project, index) => {
              const isBig = index % 5 === 0;
              return (
                <article
                  key={project.slug}
                  className={`mag-card p-6 group ${isBig ? "md:col-span-4" : "md:col-span-3"}`}
                  style={{ animationDelay: `${index * 0.04}s` }}
                >
                  <div className="flex items-center gap-2 mb-3 text-xs font-mono text-[var(--text-muted)]">
                    <span>[{String(index + 1).padStart(2, "0")}]</span>
                    {project.featured && (
                      <span className="px-2 py-0.5 rounded bg-[var(--section-glow)] text-[var(--section-accent)]">
                        ★ featured
                      </span>
                    )}
                  </div>
                  <h3 className={`font-bold mb-3 group-hover:text-[var(--section-accent)] transition-colors ${isBig ? "text-3xl" : "text-xl"}`}>
                    <span className="neon-underline">{project.title}</span>
                  </h3>
                  <p className="text-[var(--text-secondary)] text-sm mb-5">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.tech.map((t) => (
                      <span key={t} className="px-2 py-0.5 text-xs rounded bg-[var(--bg-card)] text-[var(--text-muted)] font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3 font-mono text-sm">
                    {project.live && project.live !== "#" && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--section-accent)] hover:underline"
                      >
                        → demo
                      </a>
                    )}
                    {project.github && project.github !== "#" && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--section-accent)] hover:underline"
                      >
                        → code
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Skills */}
      {skills.length > 0 && (
        <section className="animate-slide-up">
          <div className="mb-8">
            <p className="text-[var(--section-accent)] font-mono text-sm mb-1">~/skills</p>
            <h2 className="text-3xl font-bold">
              <span className="neon-underline">Stack</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((group) => (
              <div key={group.category} className="mag-card p-5">
                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="font-bold text-[var(--section-accent)]">{group.category}</h3>
                  <span className="text-xs text-[var(--text-muted)] font-mono">{group.proficiency}</span>
                </div>
                <ul className="prompt-list space-y-1 text-sm font-mono text-[var(--text-secondary)]">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
