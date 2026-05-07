"use client";

import { ReactNode } from "react";

interface TerminalWindowProps {
  title?: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "minimal";
}

export function TerminalWindow({ title, children, className = "", variant = "default" }: TerminalWindowProps) {
  if (variant === "minimal") {
    return (
      <div className={`terminal-window ${className}`}>
        <div className="terminal-body">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`terminal-window ${className}`}>
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
        </div>
        {title && (
          <span className="terminal-title">{title}</span>
        )}
        <div className="w-10" />
      </div>
      <div className="terminal-body">
        {children}
      </div>
    </div>
  );
}