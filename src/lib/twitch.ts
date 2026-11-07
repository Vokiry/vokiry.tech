export interface TwitchStreamInfo {
  isLive: boolean;
  channel: string;
  channelUrl: string;
  title: string;
  gameName: string;
  viewerCount: number;
  startedAt: string | null;
}

const DEFAULT_CHANNEL = "vokiry";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getTwitchAppToken(clientId: string, clientSecret: string): Promise<string | null> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60_000) {
    return cachedToken.token;
  }

  try {
    const res = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    cachedToken = {
      token: data.access_token,
      expiresAt: now + (data.expires_in || 3600) * 1000,
    };
    return cachedToken.token;
  } catch {
    return null;
  }
}

export async function getTwitchStatus(channel: string = DEFAULT_CHANNEL): Promise<TwitchStreamInfo> {
  const fallback: TwitchStreamInfo = {
    isLive: false,
    channel,
    channelUrl: `https://twitch.tv/${channel}`,
    title: "Вайбкодинг костылей и эксперименты",
    gameName: "Software and Game Development",
    viewerCount: 0,
    startedAt: null,
  };

  // Optional local mock for testing live state: NEXT_PUBLIC_TWITCH_MOCK_LIVE="true"
  if (process.env.NEXT_PUBLIC_TWITCH_MOCK_LIVE === "true") {
    return {
      ...fallback,
      isLive: true,
      title: "Пилим редизайн vokiry.tech на стриме // Вайбкод и костыли",
      gameName: "Software and Game Development",
      viewerCount: 42,
      startedAt: new Date().toISOString(),
    };
  }

  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return fallback;
  }

  try {
    const token = await getTwitchAppToken(clientId, clientSecret);
    if (!token) return fallback;

    const res = await fetch(
      `https://api.twitch.tv/helix/streams?user_login=${encodeURIComponent(channel.toLowerCase())}`,
      {
        headers: {
          "Client-Id": clientId,
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) return fallback;

    const body = await res.json();
    const stream = body?.data?.[0];

    if (!stream) {
      return fallback;
    }

    return {
      isLive: true,
      channel,
      channelUrl: `https://twitch.tv/${channel}`,
      title: stream.title || fallback.title,
      gameName: stream.game_name || fallback.gameName,
      viewerCount: stream.viewer_count || 0,
      startedAt: stream.started_at || null,
    };
  } catch {
    return fallback;
  }
}
