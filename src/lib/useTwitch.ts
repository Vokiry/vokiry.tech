"use client";

import { useState, useEffect } from "react";
import type { TwitchStreamInfo } from "./twitch";
import { siteConfig } from "./siteConfig";

const defaultStatus: TwitchStreamInfo = {
  isLive: false,
  channel: siteConfig.twitch.channel,
  channelUrl: siteConfig.twitch.channelUrl,
  title: "Вайбкодинг костылей и эксперименты",
  gameName: "Software and Game Development",
  viewerCount: 0,
  startedAt: null,
};

export function useTwitch() {
  const [status, setStatus] = useState<TwitchStreamInfo>(defaultStatus);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function checkStatus() {
      try {
        const res = await fetch("/api/twitch/status");
        if (res.ok) {
          const data = await res.json();
          if (mounted) setStatus(data);
        }
      } catch {
        // use fallback
      } finally {
        if (mounted) setLoading(false);
      }
    }

    checkStatus();
    const interval = setInterval(checkStatus, 60_000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { status, loading };
}
