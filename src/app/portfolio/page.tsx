import { getProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default function PortfolioPage() {
  const projects = getProjects();
  
  const skills = [
    { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
    { category: "Backend", items: ["Node.js", "Express", "PostgreSQL", "Prisma"] },
    { category: "Tools", items: ["Git", "Docker", "AWS", "Linux"] },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 gradient-text">Portfolio</h1>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-6">Projects</h2>
        {projects.length === 0 ? (
          <p className="text-[var(--text-muted)]">No projects yet. Add some in the admin dashboard!</p>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project.slug} className="glass-card p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{project.title}</h3>
                      {project.featured && (
                        <span className="px-2 py-0.5 text-xs rounded bg-[var(--primary)] text-[var(--bg-primary)]">Featured</span>
                      )}
                    </div>
                    <p className="text-[var(--text-secondary)] text-sm mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-1 text-xs rounded bg-[var(--bg-secondary)] text-[var(--text-muted)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {project.live && project.live !== "#" && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-sm rounded border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                      >
                        Live Demo
                      </a>
                    )}
                    {project.github && project.github !== "#" && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-sm rounded border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-6">Skills</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {skills.map((group) => (
            <div key={group.category} className="glass-card p-4">
              <h3 className="font-medium mb-3 text-[var(--primary)]">{group.category}</h3>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="text-sm text-[var(--text-secondary)]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}