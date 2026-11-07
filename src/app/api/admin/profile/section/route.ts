import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAbout, getNowItems, getUses, getTailsStats, getSocial, getProfile, updateProfile } from "@/lib/profile";
import { isAdmin } from "@/lib/auth";

async function guard() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(request: NextRequest) {
  const denied = await guard();
  if (denied) return denied;
  const section = new URL(request.url).searchParams.get("section");
  switch (section) {
    case "about": return NextResponse.json(getAbout());
    case "now": return NextResponse.json(getNowItems());
    case "uses": return NextResponse.json(getUses());
    case "tails": return NextResponse.json(getTailsStats());
    case "social": return NextResponse.json(getSocial());
    default: return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  const denied = await guard();
  if (denied) return denied;
  try {
    const { section, data } = await request.json();
    const profile = getProfile();
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const allowed = ["about", "now", "uses", "tails", "social"] as const;
    if (!allowed.includes(section)) {
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }
    const updated = updateProfile({ ...profile, [section]: data });
    revalidatePath("/", "layout");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update section" }, { status: 500 });
  }
}
