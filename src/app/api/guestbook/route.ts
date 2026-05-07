import { NextRequest, NextResponse } from "next/server";
import { getGuestbookEntries, addGuestbookEntry, deleteGuestbookEntry } from "@/lib/guestbook";

export async function GET() {
  const entries = getGuestbookEntries();
  return NextResponse.json(entries);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, message } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const entry = addGuestbookEntry(name || "", message);
    return NextResponse.json(entry);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const cookie = request.cookies.get("admin-auth");
  if (cookie?.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  const deleted = deleteGuestbookEntry(id);
  if (deleted) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: "Entry not found" }, { status: 404 });
}