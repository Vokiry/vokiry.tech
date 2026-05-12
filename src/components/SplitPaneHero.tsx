"use client";

import { useState } from "react";

interface FileItem {
  name: string;
  icon: string;
  content: React.ReactNode;
}

interface Props {
  whoAmI: string;
  stack: string[];
}

export function SplitPaneHero({ whoAmI, stack }: Props) {
  const files: FileItem[] = [
    {
      name: "about.md",
      icon: "📄",
      content: (
        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
          <span><span className="ide-linenum">1</span><span className="ide-kw"># </span>vokiry{"\n"}</span>
          <span><span className="ide-linenum">2</span>{"\n"}</span>
          <span><span className="ide-linenum">3</span><span className="ide-com">{">"} full-stack developer</span>{"\n"}</span>
          <span><span className="ide-linenum">4</span><span className="ide-com">{">"} terminal aesthetics enjoyer</span>{"\n"}</span>
          <span><span className="ide-linenum">5</span>{"\n"}</span>
          <span><span className="ide-linenum">6</span>{whoAmI}{"\n"}</span>
          <span><span className="ide-linenum">7</span>{"\n"}</span>
          <span><span className="ide-linenum">8</span><span className="ide-kw">## </span>links{"\n"}</span>
          <span><span className="ide-linenum">9</span>- [portfolio](/portfolio){"\n"}</span>
          <span><span className="ide-linenum">10</span>- [blog](/blog){"\n"}</span>
          <span><span className="ide-linenum">11</span>- [now](/now)<span className="ide-cursor" /></span>
        </pre>
      ),
    },
    {
      name: "stack.json",
      icon: "{ }",
      content: (
        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
          <span><span className="ide-linenum">1</span>{"{"}{"\n"}</span>
          <span><span className="ide-linenum">2</span>{"  "}<span className="ide-prop">"languages"</span>: [{"\n"}</span>
          {stack.map((s, i) => (
            <span key={s}>
              <span className="ide-linenum">{3 + i}</span>{"    "}<span className="ide-str">{`"${s}"`}</span>{i < stack.length - 1 ? "," : ""}{"\n"}
            </span>
          ))}
          <span><span className="ide-linenum">{3 + stack.length}</span>{"  "}],{"\n"}</span>
          <span><span className="ide-linenum">{4 + stack.length}</span>{"  "}<span className="ide-prop">"editor"</span>: <span className="ide-str">"neovim"</span>,{"\n"}</span>
          <span><span className="ide-linenum">{5 + stack.length}</span>{"  "}<span className="ide-prop">"shell"</span>: <span className="ide-str">"zsh"</span>,{"\n"}</span>
          <span><span className="ide-linenum">{6 + stack.length}</span>{"  "}<span className="ide-prop">"os"</span>: <span className="ide-str">"arch + cachy"</span>{"\n"}</span>
          <span><span className="ide-linenum">{7 + stack.length}</span>{"}"}</span>
        </pre>
      ),
    },
    {
      name: "now.log",
      icon: "📋",
      content: (
        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
          <span><span className="ide-linenum">1</span><span className="ide-com">[INFO] currently working on:</span>{"\n"}</span>
          <span><span className="ide-linenum">2</span>{"  "}<span className="ide-fn">- </span>this site (terminal 2.0){"\n"}</span>
          <span><span className="ide-linenum">3</span>{"  "}<span className="ide-fn">- </span>devtools & utilities{"\n"}</span>
          <span><span className="ide-linenum">4</span>{"  "}<span className="ide-fn">- </span>writing more often{"\n"}</span>
          <span><span className="ide-linenum">5</span>{"\n"}</span>
          <span><span className="ide-linenum">6</span><span className="ide-com">[INFO] reading:</span>{"\n"}</span>
          <span><span className="ide-linenum">7</span>{"  "}<span className="ide-fn">- </span>designing data-intensive applications{"\n"}</span>
          <span><span className="ide-linenum">8</span>{"\n"}</span>
          <span><span className="ide-linenum">9</span><span className="ide-com">[INFO] status:</span> <span className="ide-str">"online"</span><span className="ide-cursor" /></span>
        </pre>
      ),
    },
    {
      name: "contact.sh",
      icon: "$",
      content: (
        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
          <span><span className="ide-linenum">1</span><span className="ide-com">#!/usr/bin/env bash</span>{"\n"}</span>
          <span><span className="ide-linenum">2</span>{"\n"}</span>
          <span><span className="ide-linenum">3</span><span className="ide-kw">echo</span> <span className="ide-str">{`"reach me at:"`}</span>{"\n"}</span>
          <span><span className="ide-linenum">4</span><span className="ide-kw">echo</span> <span className="ide-str">{`"  github.com/vokiry"`}</span>{"\n"}</span>
          <span><span className="ide-linenum">5</span><span className="ide-kw">echo</span> <span className="ide-str">{`"  /guestbook  ← sign it"`}</span>{"\n"}</span>
          <span><span className="ide-linenum">6</span>{"\n"}</span>
          <span><span className="ide-linenum">7</span><span className="ide-kw">exit </span><span className="ide-str">0</span><span className="ide-cursor" /></span>
        </pre>
      ),
    },
  ];

  const [active, setActive] = useState(0);

  return (
    <div className="ide-pane shadow-2xl">
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-card)] border-b border-[var(--border)]">
        <div className="flex gap-2">
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
        </div>
        <span className="text-xs text-[var(--text-muted)] font-mono">vokiry — {files[active].name}</span>
        <span className="text-xs text-[var(--text-muted)] font-mono">— [+]</span>
      </div>

      {/* Tab bar */}
      <div className="ide-tabbar overflow-x-auto">
        {files.map((f, i) => (
          <button
            key={f.name}
            onClick={() => setActive(i)}
            className={`ide-tab whitespace-nowrap ${i === active ? "text-[var(--text-primary)]" : "border-t-transparent opacity-60 hover:opacity-100"}`}
            style={i === active ? {} : { borderTopColor: "transparent" }}
          >
            <span className="text-[var(--section-accent)]">{f.icon}</span>
            {f.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr]">
        {/* File tree */}
        <div className="ide-tree hidden md:block">
          <div className="text-[var(--text-muted)] text-xs uppercase tracking-wider px-2 mb-2">Explorer</div>
          <div className="text-[var(--text-secondary)] text-xs flex items-center gap-1 px-2 mb-1">▾ <span className="text-[var(--section-accent)]">vokiry/</span></div>
          {files.map((f, i) => (
            <div
              key={f.name}
              onClick={() => setActive(i)}
              className={`ide-tree-item ml-3 ${i === active ? "active" : ""}`}
            >
              <span className="text-[var(--text-muted)]">{f.icon}</span>
              {f.name}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="ide-content overflow-x-auto">{files[active].content}</div>
      </div>
    </div>
  );
}
