import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = "https://vokiry.tech";
  const posts = getAllPosts();

  const samplePosts = [
    {
      title: "Getting Started with Next.js 14",
      slug: "getting-started-nextjs-14",
      date: "2024-01-15",
      excerpt: "Exploring the new features in Next.js 14 and how to get started with App Router.",
    },
    {
      title: "Building Developer Tools",
      slug: "building-developer-tools",
      date: "2024-01-10",
      excerpt: "Thoughts on what makes a good developer tool and lessons learned building utilities.",
    },
    {
      title: "Welcome to My Blog",
      slug: "welcome-to-my-blog",
      date: "2024-01-01",
      excerpt: "Starting a new journey in writing about development and sharing knowledge.",
    },
  ];

  const displayPosts = posts.length > 0 ? posts : samplePosts;
  const lastUpdated = displayPosts[0]?.date || new Date().toISOString().split('T')[0];

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>vokiry.tech</title>
    <link>${siteUrl}</link>
    <description>Developer portfolio, utilities, and blog</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <generator>vokiry.tech</generator>
    ${displayPosts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
    </item>`).join('')}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}