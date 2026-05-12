import { NextRequest, NextResponse } from "next/server";
import { getGuestbookEntries, addGuestbookEntry, deleteGuestbookEntry } from "@/lib/guestbook";
import { isAdmin } from "@/lib/auth";

const RATE: Map<string, { count: number; reset: number }> = (globalThis as unknown as { __gbRate?: Map<string, { count: number; reset: number }> }).__gbRate ?? new Map();
(globalThis as unknown as { __gbRate?: typeof RATE }).__gbRate = RATE;

const LIMIT = 5;
const WINDOW_MS = 60_000;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const rec = RATE.get(ip);
  if (!rec || rec.reset < now) {
    RATE.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (rec.count >= LIMIT) return false;
  rec.count++;
  return true;
}

function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function GET() {
  return NextResponse.json(getGuestbookEntries());
}

export async function POST(request: NextRequest) {
  if (!rateLimit(clientIp(request))) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  try {
    const { name, message } = await request.json();
    const trimmed = (message ?? "").toString().trim();
    if (!trimmed) return NextResponse.json({ error: "Message required" }, { status: 400 });
    if (trimmed.length > 1000) return NextResponse.json({ error: "Message too long" }, { status: 400 });
    const safeName = (name ?? "").toString().slice(0, 60);
    const entry = addGuestbookEntry(safeName, trimmed.slice(0, 1000));
    return NextResponse.json(entry);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  return deleteGuestbookEntry(id)
    ? NextResponse.json({ success: true })
    : NextResponse.json({ error: "Entry not found" }, { status: 404 });
}
