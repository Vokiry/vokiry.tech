"use client";

import { useEffect, useRef } from "react";
import Prism from "prismjs";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    Prism.highlightAllUnder(containerRef.current);
    return () => {
      // Cleanup if needed
    };
  }, [content]);

  const parseMarkdown = (md: string) => {
    let html = md;

    // Code blocks with language
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      const language = lang || "text";
      const escapedCode = code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return `<div class="code-block-wrapper" data-language="${language}"><pre class="language-${language}"><code class="language-${language}">${escapedCode}</code></pre></div>`;
    });

    // Headers
    html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
    html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
    html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

    // Bold and italic
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>");
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
    html = html.replace(/___(.*?)___/g, "<strong><em>$1</em></strong>");
    html = html.replace(/__(.*?)__/g, "<strong>$1</strong>");
    html = html.replace(/_(.*?)_/g, "<em>$1</em>");

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

    // Lists
    html = html.replace(/^\- (.*$)/gim, "<li>$1</li>");
    html = html.replace(/(<li>[\s\S]*?<\/li>)/g, "<ul>$1</ul>");

    // Numbered lists
    html = html.replace(/^\d+\. (.*$)/gim, "<li>$1</li>");

    // Blockquotes
    html = html.replace(/^&gt; (.*$)/gim, "<blockquote>$1</blockquote>");

    // Horizontal rule
    html = html.replace(/^---$/gim, "<hr />");

    // Paragraphs
    html = html.replace(/\n\n/g, "</p><p>");
    html = "<p>" + html + "</p>";

    // Clean up empty paragraphs
    html = html.replace(/<p>\s*<\/p>/g, "");
    html = html.replace(/<p>(<h[1-6]>)/g, "$1");
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, "$1");
    html = html.replace(/<p>(<ul>)/g, "$1");
    html = html.replace(/(<\/ul>)<\/p>/g, "$1");
    html = html.replace(/<p>(<blockquote>)/g, "$1");
    html = html.replace(/(<\/blockquote>)<\/p>/g, "$1");
    html = html.replace(/<p>(<div class="code-block)/g, "$1");
    html = html.replace(/(<div class="code-block[^"]*")><\/p>/g, "$1>");
    html = html.replace(/<p>(<hr \/>)/g, "$1");
    html = html.replace(/(<hr \/>)<\/p>/g, "$1");

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    return html;
  };

  return (
    <div 
      ref={containerRef}
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
}