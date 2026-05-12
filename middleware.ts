import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const ALLOWED = (process.env.ADMIN_GITHUB_LOGINS || "vokiry")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAdminArea =
    pathname.startsWith("/admin/dashboard") || pathname.startsWith("/api/admin");

  if (!isAdminArea) return NextResponse.next();

  const login = (req.auth as unknown as { login?: string } | null)?.login?.toLowerCase();
  const ok = !!login && ALLOWED.includes(login);

  if (!ok) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/dashboard/:path*", "/api/admin/:path*"],
};
