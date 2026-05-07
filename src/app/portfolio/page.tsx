import { getProjects } from "@/lib/projects";
import { getSkills } from "@/lib/skills";
import { TerminalWindow } from "@/components/TerminalWindow";

export const dynamic = "force-dynamic";

export default function PortfolioPage() {
  const projects = getProjects();
  const skills = getSkills();
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 gradient-text">/portfolio</h1>

      {/* Terminal Header */}
      <div className="mb-8 animate-scale-in">
        <TerminalWindow title="~ ls projects/">
          <pre className="text-[var(--text-primary)] font-mono text-sm">
<span className="text-[var(--section-accent)]">$</span> ls -la projects/
total {projects.length}
drwxr-xr-x  {projects.length}  {new Date().toLocaleDateString()}
.</pre>
        </TerminalWindow>
      </div>

      {/* Projects */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="text-[var(--section-accent)]">~/portfolio/projects</span>
        </h2>
        {projects.length === 0 ? (
          <TerminalWindow variant="minimal">
            <p className="text-[var(--text-muted)]">No projects yet. Add some in the admin dashboard!</p>
          </TerminalWindow>
        ) : (
          <div className="space-y-4 stagger-2">
            {projects.map((project, index) => (
              <div key={project.slug} className="terminal-card p-5 animate-slide-up" style={{ animationDelay: `${(index + 1) * 0.05}s` }}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-[var(--text-muted)] text-sm">
                        [{index + 1}]
                      </span>
                      <h3 className="text-lg font-semibold">{project.title}</h3>
                      {project.featured && (
                        <span className="px-2 py-0.5 text-xs rounded bg-[var(--section-glow)] text-[var(--section-accent)]">
                          ★ Featured
                        </span>
                      )}
                    </div>
                    <p className="text-[var(--text-secondary)] text-sm mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-1 text-xs rounded bg-[var(--bg-card)] text-[var(--text-muted)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {project.live && project.live !== "#" && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-sm hover-glow"
                      >
                        Demo
                      </a>
                    )}
                    {project.github && project.github !== "#" && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-sm hover-glow"
                      >
                        Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="text-[var(--section-accent)]">~/portfolio/skills</span>
        </h2>
        {skills.length === 0 ? (
          <TerminalWindow variant="minimal">
            <p className="text-[var(--text-muted)]">No skills added yet.</p>
          </TerminalWindow>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-3">
            {skills.map((group, index) => (
              <div key={group.category} className="terminal-card p-4 animate-slide-up" style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
                <h3 className="font-medium mb-3 text-[var(--section-accent)]">{group.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="px-2 py-1 text-xs rounded bg-[var(--bg-card)] text-[var(--text-secondary)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  {group.proficiency}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}