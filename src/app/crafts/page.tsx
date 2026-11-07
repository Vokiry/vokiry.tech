"use client";

import { useState } from "react";
import Link from "next/link";
import projectsData from "@/content/projects.json";

export default function CraftsPage() {
  const [selectedTag, setSelectedTag] = useState<string>("ALL");

  const allTags = [
    "ALL",
    ...Array.from(new Set(projectsData.flatMap((p) => p.tech))).slice(0, 8),
  ];

  const filteredProjects =
    selectedTag === "ALL"
      ? projectsData
      : projectsData.filter((p) => p.tech.includes(selectedTag));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* --------------------------------------------------------------------
          Header
          -------------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 font-mono text-xs text-ctp-subtext0">
          <span className="tui-chip aug-br text-ctp-mauve">[ 03 // КОСТЫЛИ ]</span>
          <span className="text-ctp-overlay0">//</span>
          <span>CODE REPOSITORY &amp; EXPERIMENTS</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-6xl font-bold font-display tracking-tight text-ctp-text">
              ~/костыли
            </h1>
            <p className="text-base text-ctp-subtext0 mt-2 max-w-2xl leading-relaxed">
              Поделки, скрипты на коленке, стрим-оверлеи и софт. Написано под две шаурмы и 89 редбуллов, 
              но стабильно работающее и решающее реальные задачи.
            </p>
          </div>

          <div className="font-mono text-xs text-ctp-overlay1">
            <span>INDEX: {projectsData.length} PROJECTS // ALL_CLEAN</span>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          Tag Filters
          -------------------------------------------------------------------- */}
      <section className="flex flex-wrap items-center gap-2 pt-2 border-b border-[var(--border-subtle)] pb-4 font-mono text-xs">
        <span className="text-ctp-overlay0 mr-1">// ФИЛЬТР:</span>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`aug-br px-3 py-1 transition-all cursor-pointer ${
              selectedTag === tag
                ? "bg-ctp-mauve text-ctp-base font-semibold"
                : "border border-[var(--border)] bg-ctp-surface0 text-ctp-subtext0 hover:border-ctp-mauve hover:text-ctp-text"
            }`}
          >
            {tag === "ALL" ? "Все поделки" : tag}
          </button>
        ))}
      </section>

      {/* --------------------------------------------------------------------
          Projects Grid
          -------------------------------------------------------------------- */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((project, idx) => (
          <div
            key={project.slug || idx}
            className="panel-card aug-br p-6 flex flex-col justify-between group hover:border-ctp-mauve/60 transition-all"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-ctp-overlay0 mb-3">
                <span>[CRAFT_{String(idx + 1).padStart(2, "0")}]</span>
                {project.featured && (
                  <span className="text-ctp-peach font-semibold">★ FEATURED</span>
                )}
              </div>

              <h2 className="text-xl font-bold font-display text-ctp-text group-hover:text-ctp-mauve transition-colors mb-2">
                {project.title}
              </h2>

              <p className="text-xs sm:text-sm text-ctp-subtext0 leading-relaxed mb-6">
                {project.description}
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
              {/* Tech Tags */}
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 text-[11px] font-mono bg-ctp-surface1 text-ctp-subtext0 border border-[var(--border-subtle)]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Action Links */}
              <div className="flex items-center gap-4 text-xs font-mono pt-1">
                {project.github && project.github !== "#" && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ctp-mauve hover:underline font-semibold"
                  >
                    GitHub ↗
                  </a>
                )}
                {project.live && project.live !== "#" && (
                  <Link
                    href={project.live}
                    className="text-ctp-teal hover:underline font-semibold"
                  >
                    Демо / Подробнее ↗
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* --------------------------------------------------------------------
          Bottom Callout
          -------------------------------------------------------------------- */}
      <section className="panel-sharp aug-br p-6 stripe-bg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="font-mono text-xs text-ctp-mauve mb-1">// ОПЕНСОРС &amp; ИДЕИ</div>
          <p className="text-xs sm:text-sm text-ctp-text">
            Есть идея для безумного стрим-виджета или хотите допилить костыль вместе?
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Vokiry"
            target="_blank"
            rel="noopener noreferrer"
            className="aug-br px-4 py-2 font-mono text-xs font-semibold bg-ctp-surface0 border border-[var(--border)] text-ctp-text hover:border-ctp-mauve hover:text-ctp-mauve transition-colors"
          >
            GitHub профиль ↗
          </a>
          <Link
            href="/wall"
            className="aug-br px-4 py-2 font-mono text-xs font-semibold bg-ctp-mauve text-ctp-base hover:opacity-90 transition-opacity"
          >
            Написать на заборе →
          </Link>
        </div>
      </section>
    </div>
  );
}
