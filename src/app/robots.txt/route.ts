import { NextResponse } from "next/server";

export async function GET() {
  const robots = `User-agent: *
Allow: /

Sitemap: https://vokiry.tech/sitemap.xml

# Disallow admin
Disallow: /admin
`;

  return new NextResponse(robots, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}