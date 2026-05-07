"use client";

import { useEffect, useRef, useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";

interface CodeBlockProps {
  code: string;
  language?: string;
}

const languageMap: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  py: "python",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  yml: "yaml",
  md: "markdown",
};

export function CodeBlock({ code, language = "javascript" }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  const normalizedLang = languageMap[language] || language;

  useEffect(() => {
    setMounted(true);
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, normalizedLang]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted) {
    return (
      <div className="code-block-wrapper relative group rounded-md overflow-hidden border border-[var(--border)]">
        {language && (
          <div className="absolute top-0 left-0 px-3 py-1 text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] border-b border-[var(--border)] rounded-tl-md">
            {language}
          </div>
        )}
        <pre className="p-4 pt-8 overflow-x-auto bg-[var(--bg-secondary)]">
          <code className="text-sm font-mono">{code}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className="code-block-wrapper relative group rounded-md overflow-hidden border border-[var(--border)]">
      {language && (
        <div className="absolute top-0 left-0 px-3 py-1 text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] border-b border-[var(--border)] rounded-tl-md z-10">
          {language}
        </div>
      )}
      
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all opacity-0 group-hover:opacity-100 z-10"
      >
        {copied ? "Copied!" : "Copy"}
      </button>

      <pre className="p-4 pt-8 overflow-x-auto bg-[var(--bg-secondary)]">
        <code ref={codeRef} className={`language-${normalizedLang} text-sm font-mono`}>
          {code}
        </code>
      </pre>
    </div>
  );
}