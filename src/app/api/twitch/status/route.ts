import { NextResponse } from "next/server";
import { getTwitchStatus } from "@/lib/twitch";
import { siteConfig } from "@/lib/siteConfig";

export async function GET() {
  const status = await getTwitchStatus(siteConfig.twitch.channel);
  return NextResponse.json(status);
}
