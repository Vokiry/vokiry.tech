"use client";

import { useEffect, useRef } from "react";

interface GiscusProps {
  repo?: string;
  repoId?: string;
  category?: string;
  categoryId?: string;
}

export function Giscus({ 
  repo = "vokiry/vokiry.tech", 
  repoId = "R_placeholder",
  category = "Blog Comments", 
  categoryId = "DIC_placeholder" 
}: GiscusProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

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
    script.setAttribute("data-lang", "en");
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
    <div className="mt-12 pt-8 border-t border-[var(--border)]">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>
      <div ref={ref} className="min-h-[200px]" />
      <p className="text-sm text-[var(--text-muted)] mt-4">
        Powered by{" "}
        <a 
          href="https://giscus.app" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[var(--primary)] hover:underline"
        >
          giscus
        </a>
      </p>
    </div>
  );
}