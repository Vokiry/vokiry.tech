import fs from "fs";
import path from "path";

const profilePath = path.join(process.cwd(), "src/content/profile.json");

export interface NowItem {
  item: string;
  description: string;
}

export interface HardwareItem {
  name: string;
  spec: string;
  note: string;
}

export interface HardwareCategories {
  computer: HardwareItem[];
  peripherals: HardwareItem[];
  streaming: HardwareItem[];
  software: HardwareItem[];
}

export interface Uses {
  hardware: string[];
  software: string[];
}

export interface TailsStats {
  status: string;
  location: string;
  tailLength: number;
  energy: number;
  napsToday: number;
  bamboo: number;
}

export interface Social {
  twitch?: string;
  github: string;
  twitter: string;
  telegram: string;
  email: string;
  donate?: string;
}

export interface About {
  whoAmI: string;
  whatIDo: string;
}

export interface Profile {
  about: About;
  now: NowItem[];
  hardware: HardwareCategories;
  uses: Uses;
  tails: TailsStats;
  social: Social;
}

const defaultProfile: Profile = {
  about: {
    whoAmI: "Дурной вайбкодер и микростример (медианищета).",
    whatIDo: "Пишу код на чистом вайбе, стримлю эксперименты на Twitch.",
  },
  now: [],
  hardware: {
    computer: [],
    peripherals: [],
    streaming: [],
    software: [],
  },
  uses: {
    hardware: [],
    software: [],
  },
  tails: {
    status: "fluffy",
    location: "somewhere warm",
    tailLength: 85,
    energy: 65,
    napsToday: 3,
    bamboo: 12,
  },
  social: {
    twitch: "https://twitch.tv/vokiry",
    github: "https://github.com/Vokiry",
    twitter: "https://twitter.com/Vokkiry",
    telegram: "https://t.me/Vokiry",
    email: "vokiiry@gmail.com",
    donate: "https://www.donationalerts.com/r/vokiry",
  },
};

export function getProfile(): Profile {
  if (!fs.existsSync(profilePath)) {
    return defaultProfile;
  }
  try {
    const data = JSON.parse(fs.readFileSync(profilePath, "utf8"));
    return {
      about: data.about || defaultProfile.about,
      now: data.now || defaultProfile.now,
      hardware: data.hardware || defaultProfile.hardware,
      uses: data.uses || defaultProfile.uses,
      tails: data.tails || defaultProfile.tails,
      social: data.social || defaultProfile.social,
    };
  } catch {
    return defaultProfile;
  }
}

export function updateProfile(data: Partial<Profile>): Profile {
  const current = getProfile();
  const updated: Profile = {
    about: data.about ? { ...current.about, ...data.about } : current.about,
    now: data.now || current.now,
    hardware: data.hardware || current.hardware,
    uses: data.uses || current.uses,
    tails: data.tails ? { ...current.tails, ...data.tails } : current.tails,
    social: data.social ? { ...current.social, ...data.social } : current.social,
  };

  fs.writeFileSync(profilePath, JSON.stringify(updated, null, 2), "utf8");
  return updated;
}

export function getAbout(): About {
  return getProfile().about;
}

export function getNowItems(): NowItem[] {
  return getProfile().now;
}

export function getHardware(): HardwareCategories {
  return getProfile().hardware;
}

export function getUses(): Uses {
  return getProfile().uses;
}

export function getTailsStats(): TailsStats {
  return getProfile().tails;
}

export function getSocial(): Social {
  return getProfile().social;
}
