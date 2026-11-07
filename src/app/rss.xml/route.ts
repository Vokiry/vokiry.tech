import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = "https://vokiry.tech";
  const posts = getAllPosts();

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>vokiry.tech // станция</title>
    <link>${siteUrl}</link>
    <description>Дурной вайбкодер × Медианищета // Заметки, стримы и костыли</description>
    <language>ru-ru</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <generator>vokiry.tech</generator>
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/notes/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/notes/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
