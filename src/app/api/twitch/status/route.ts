import { NextResponse } from "next/server";
import { getTwitchStatus } from "@/lib/twitch";
import { getProfile } from "@/lib/profile";
import { siteConfig } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

export async function GET() {
  const profile = getProfile();
  let channel = siteConfig.twitch.channel;
  if (profile.social?.twitch) {
    channel = profile.social.twitch
      .replace(/^https?:\/\/(www\.)?twitch\.tv\//i, "")
      .replace(/\/$/, "");
  }

  const status = await getTwitchStatus(channel || siteConfig.twitch.channel);
  return NextResponse.json(status);
}
