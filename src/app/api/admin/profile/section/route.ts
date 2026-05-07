import { NextRequest, NextResponse } from "next/server";
import { getAbout, getNowItems, getUses, getTailsStats, getSocial, getProfile, updateProfile } from "@/lib/profile";

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get("admin-auth");
  if (cookie?.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    let data;
    
    switch (section) {
      case "about":
        data = getAbout();
        break;
      case "now":
        data = getNowItems();
        break;
      case "uses":
        data = getUses();
        break;
      case "tails":
        data = getTailsStats();
        break;
      case "social":
        data = getSocial();
        break;
      default:
        data = { error: "Invalid section" };
        return NextResponse.json(data, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch section" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const cookie = request.cookies.get("admin-auth");
  if (cookie?.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { section, data } = body;

    const profile = getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    let updated;
    
    switch (section) {
      case "about":
        updated = updateProfile({ ...profile, about: data });
        break;
      case "now":
        updated = updateProfile({ ...profile, now: data });
        break;
      case "uses":
        updated = updateProfile({ ...profile, uses: data });
        break;
      case "tails":
        updated = updateProfile({ ...profile, tails: data });
        break;
      case "social":
        updated = updateProfile({ ...profile, social: data });
        break;
      default:
        return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update section" }, { status: 500 });
  }
}