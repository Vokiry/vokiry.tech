import { NextResponse } from "next/server";
import { getTwitchStatus } from "@/lib/twitch";

export async function GET() {
  const status = await getTwitchStatus("vokiry");
  return NextResponse.json(status);
}
