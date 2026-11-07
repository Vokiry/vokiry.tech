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
}

export interface About {
  whoAmI: string;
  whatIDo: string;
}

export interface Profile {
  about: About;
  now: NowItem[];
  hardware?: HardwareCategories;
  uses?: Uses;
  tails?: TailsStats;
  social: Social;
}

export function getProfile(): Profile | null {
  if (!fs.existsSync(profilePath)) {
    return null;
  }
  try {
    const data = fs.readFileSync(profilePath, "utf8");
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function updateProfile(data: Partial<Profile>): Profile | null {
  const current = getProfile();
  if (!current) {
    return null;
  }

  const updated = { ...current, ...data };
  fs.writeFileSync(profilePath, JSON.stringify(updated, null, 2), "utf8");

  return updated;
}

export function getAbout(): About {
  const profile = getProfile();
  return profile?.about || {
    whoAmI: "",
    whatIDo: "",
  };
}

export function getNowItems(): NowItem[] {
  const profile = getProfile();
  return profile?.now || [];
}

export function getHardware(): HardwareCategories {
  const profile = getProfile();
  return profile?.hardware || {
    computer: [],
    peripherals: [],
    streaming: [],
    software: [],
  };
}

export function getUses(): Uses {
  const profile = getProfile();
  if (profile?.uses) return profile.uses;
  if (profile?.hardware) {
    return {
      hardware: [
        ...profile.hardware.computer.map((c) => `${c.name}: ${c.spec}`),
        ...profile.hardware.peripherals.map((c) => `${c.name}: ${c.spec}`),
        ...profile.hardware.streaming.map((c) => `${c.name}: ${c.spec}`),
      ],
      software: profile.hardware.software.map((s) => `${s.name}: ${s.spec}`),
    };
  }
  return { hardware: [], software: [] };
}

export function getTailsStats(): TailsStats {
  const profile = getProfile();
  return profile?.tails || {
    status: "fluffy",
    location: "somewhere warm",
    tailLength: 50,
    energy: 50,
    napsToday: 50,
    bamboo: 50
  };
}

export function getSocial(): Social {
  const profile = getProfile();
  return profile?.social || {
    twitch: "https://twitch.tv/vokiry",
    github: "",
    twitter: "",
    telegram: "",
    email: ""
  };
}
