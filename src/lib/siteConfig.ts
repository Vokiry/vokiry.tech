export interface NavItem {
  href: string;
  aliases?: string[];
  label: string;
  code: string;
  desc: string;
}

export interface SiteConfig {
  siteUrl: string;
  version: string;
  stationId: string;
  author: {
    name: string;
    handle: string;
    title: string;
    role: string;
    bio: string;
  };
  twitch: {
    channel: string;
    channelUrl: string;
    mockLive: boolean;
  };
  socials: {
    github: string;
    telegram: string;
    twitter: string;
    email: string;
    donate: string;
  };
  navigation: NavItem[];
  chatCommands: Array<{ cmd: string; desc: string }>;
  giscus: {
    repo: string;
    repoId: string;
    category: string;
    categoryId: string;
  };
}

const rawDomain = process.env.DOMAIN || "vokiry.tech";
const domain = rawDomain.startsWith("http") ? rawDomain : `https://${rawDomain}`;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || domain;
const twitchChannel = process.env.NEXT_PUBLIC_TWITCH_CHANNEL || "vokiry";
const authorName = process.env.NEXT_PUBLIC_AUTHOR_NAME || "vokiry";

export const siteConfig: SiteConfig = {
  siteUrl,
  version: process.env.NEXT_PUBLIC_APP_VERSION || "v0.3.0",
  stationId: process.env.NEXT_PUBLIC_STATION_ID || "VOKIRY-01",
  author: {
    name: authorName,
    handle: `@${authorName}`,
    title: `${authorName}.tech // станция`,
    role: "дурной вайбкодер × медианищета",
    bio: "Пишу код на чистом вайбе, стримлю эксперименты на Twitch, собираю оверлеи и софт из костылей и энтузиазма. Здесь собраны мои поделки, сетап медианищеты, трансляции и заметки с полей.",
  },
  twitch: {
    channel: twitchChannel,
    channelUrl: `https://twitch.tv/${twitchChannel}`,
    mockLive: process.env.NEXT_PUBLIC_TWITCH_MOCK_LIVE === "true",
  },
  socials: {
    github: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/Vokiry",
    telegram: process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/Vokiry",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "https://twitter.com/Vokkiry",
    email: process.env.NEXT_PUBLIC_EMAIL || "vokiiry@gmail.com",
    donate: process.env.NEXT_PUBLIC_DONATE_URL || "https://www.donationalerts.com/r/vokiry",
  },
  navigation: [
    { href: "/", label: "~/база", code: "01", desc: "Главный командный пункт" },
    { href: "/live", aliases: ["/tails"], label: "~/подруб", code: "02", desc: "Twitch стрим и статус" },
    { href: "/crafts", aliases: ["/portfolio"], label: "~/костыли", code: "03", desc: "Проекты, скрипты и вайбкод" },
    { href: "/hardware", aliases: ["/uses"], label: "~/железки", code: "04", desc: "Сетап и софт медианищеты" },
    { href: "/notes", aliases: ["/blog"], label: "~/графомания", code: "05", desc: "Мысли, заметки и статьи" },
    { href: "/wall", aliases: ["/guestbook"], label: "~/забор", code: "06", desc: "Черкануть пару слов в чат" },
    { href: "/tools", aliases: ["/utilities"], label: "~/верстак", code: "07", desc: "Микро-утилиты и конвертеры" },
  ],
  chatCommands: [
    { cmd: "!git", desc: "Ссылка на GitHub со всеми открытыми костылями" },
    { cmd: "!setup", desc: "Сетап медианищеты и рабочее железо" },
    { cmd: "!tg", desc: "Телеграм-канал с анонсами и щитпостингом" },
    { cmd: "!костыли", desc: "Текущий проект, над которым сейчас потеем" },
    { cmd: "!музыка", desc: "Плейлист со стрима или текущий трек" },
    { cmd: "!дроп", desc: "Узнать, когда следующий запланированный подруб" },
  ],
  giscus: {
    repo: process.env.NEXT_PUBLIC_GISCUS_REPO || "Vokiry/vokiry.tech",
    repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID || "",
    category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY || "General",
    categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || "",
  },
};
