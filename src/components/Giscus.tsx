"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "@/lib/siteConfig";

interface GiscusProps {
  repo?: string;
  repoId?: string;
  category?: string;
  categoryId?: string;
}

export function Giscus({ 
  repo = siteConfig.giscus.repo, 
  repoId = siteConfig.giscus.repoId,
  category = siteConfig.giscus.category, 
  categoryId = siteConfig.giscus.categoryId 
}: GiscusProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (!repoId || !categoryId) return; // Don't load if unconfigured

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", category);
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "dark");
    script.setAttribute("data-lang", "ru");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    ref.current.appendChild(script);

    return () => {
      if (ref.current) {
        ref.current.innerHTML = "";
      }
    };
  }, [repo, repoId, category, categoryId]);

  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
        <span className="text-ctp-mauve font-bold">// ОБСУЖДЕНИЕ</span>
        <span className="text-ctp-overlay0">[GISCUS]</span>
      </div>
      
      {!repoId ? (
        <div className="panel-sharp aug-br p-4 text-ctp-overlay1 text-xs">
          [ Комментарии отключены или ожидают заполнения NEXT_PUBLIC_GISCUS_REPO_ID в .env ]
        </div>
      ) : (
        <div ref={ref} className="min-h-[160px]" />
      )}
    </div>
  );
}
