"use client";

import { useState, useEffect, ReactNode } from "react";

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
}

export function Typewriter({ text, speed = 50, className = "" }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!text) return;
    let index = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayedText}
      <span className="animate-blink">▋</span>
    </span>
  );
}

interface NeonTextProps {
  children: ReactNode;
  className?: string;
}

export function NeonText({ children, className = "" }: NeonTextProps) {
  return (
    <span className={`animate-neon ${className}`}>
      {children}
    </span>
  );
}