import { NextRequest, NextResponse } from "next/server";
import { getProfile, updateProfile } from "@/lib/profile";
import { isAdmin } from "@/lib/auth";

async function guard() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  const profile = getProfile();
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  return NextResponse.json(profile);
}

export async function PUT(request: NextRequest) {
  const denied = await guard();
  if (denied) return denied;
  try {
    const updated = updateProfile(await request.json());
    if (!updated) return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
