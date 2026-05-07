import fs from "fs";
import path from "path";

const postsDirectory = path.join(process.cwd(), "src/content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const files = fs.readdirSync(postsDirectory);
  const posts = files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(".mdx", "");
      const content = fs.readFileSync(path.join(postsDirectory, file), "utf8");
      return parsePost(slug, content);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getPost(slug: string): BlogPost | null {
  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const content = fs.readFileSync(filePath, "utf8");
  return parsePost(slug, content);
}

export function createPost(post: Omit<BlogPost, "slug">): BlogPost {
  const slug = post.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  const frontmatter = `---
title: "${post.title}"
date: "${post.date}"
excerpt: "${post.excerpt}"
tags: [${post.tags.map((t) => `"${t}"`).join(", ")}]
---

${post.content}`;

  fs.writeFileSync(filePath, frontmatter, "utf8");

  return { ...post, slug };
}

export function updatePost(slug: string, post: Partial<BlogPost>): BlogPost | null {
  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const existing = getPost(slug);
  if (!existing) return null;

  const updated = { ...existing, ...post };
  const frontmatter = `---
title: "${updated.title}"
date: "${updated.date}"
excerpt: "${updated.excerpt}"
tags: [${updated.tags.map((t) => `"${t}"`).join(", ")}]
---

${updated.content}`;

  fs.writeFileSync(filePath, frontmatter, "utf8");
  return updated;
}

export function deletePost(slug: string): boolean {
  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return false;
  }
  fs.unlinkSync(filePath);
  return true;
}

function parsePost(slug: string, content: string): BlogPost {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  
  if (!frontmatterMatch) {
    return {
      slug,
      title: slug,
      date: new Date().toISOString().split("T")[0],
      excerpt: "",
      tags: [],
      content,
    };
  }

  const frontmatter = frontmatterMatch[1];
  const body = content.slice(frontmatterMatch[0].length).trim();

  const getField = (field: string): string => {
    const match = frontmatter.match(new RegExp(`${field}:\\s*"([^"]*)"`));
    return match ? match[1] : "";
  };

  const getTags = (): string[] => {
    const match = frontmatter.match(/tags:\\s*\\[(.*?)\\]/);
    if (!match) return [];
    return match[1]
      .split(",")
      .map((t) => t.trim().replace(/"/g, ""))
      .filter(Boolean);
  };

  return {
    slug,
    title: getField("title"),
    date: getField("date"),
    excerpt: getField("excerpt"),
    tags: getTags(),
    content: body,
  };
}