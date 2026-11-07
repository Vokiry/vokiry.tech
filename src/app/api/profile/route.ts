import { NextResponse } from "next/server";
import { getProfile } from "@/lib/profile";

export const dynamic = "force-dynamic";

export async function GET() {
  const profile = getProfile();
  return NextResponse.json(profile);
}
