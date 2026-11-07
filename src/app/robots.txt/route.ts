import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/siteConfig";

export async function GET() {
  const robots = `User-agent: *
Allow: /

Sitemap: ${siteConfig.siteUrl}/sitemap.xml

# Disallow admin
Disallow: /admin
Disallow: /api/admin
`;

  return new NextResponse(robots, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
