import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/siteConfig";

const staticPages = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/live", priority: "0.9", changefreq: "daily" },
  { path: "/crafts", priority: "0.9", changefreq: "weekly" },
  { path: "/hardware", priority: "0.8", changefreq: "monthly" },
  { path: "/notes", priority: "0.9", changefreq: "weekly" },
  { path: "/wall", priority: "0.8", changefreq: "daily" },
  { path: "/tools", priority: "0.8", changefreq: "monthly" },
  { path: "/tools/mapart", priority: "0.8", changefreq: "monthly" },
  { path: "/tools/image", priority: "0.8", changefreq: "monthly" },
  { path: "/about", priority: "0.6", changefreq: "monthly" },
];

export async function GET() {
  const posts = getAllPosts();
  const postPages = posts.map((p) => ({
    path: `/notes/${p.slug}`,
    priority: "0.8",
    changefreq: "monthly",
  }));

  const allPages = [...staticPages, ...postPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${siteConfig.siteUrl}${page.path}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
