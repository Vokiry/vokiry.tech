import fs from "fs";
import path from "path";

const guestbookPath = path.join(process.cwd(), "src/content/guestbook.json");

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  date: string;
}

export function getGuestbookEntries(): GuestbookEntry[] {
  if (!fs.existsSync(guestbookPath)) {
    return [];
  }
  try {
    const data = fs.readFileSync(guestbookPath, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function addGuestbookEntry(name: string, message: string): GuestbookEntry {
  const entries = getGuestbookEntries();
  
  const newEntry: GuestbookEntry = {
    id: Date.now().toString(),
    name: name.trim() || "Anonymous",
    message: message.trim(),
    date: new Date().toISOString().split("T")[0],
  };

  entries.unshift(newEntry);
  fs.writeFileSync(guestbookPath, JSON.stringify(entries, null, 2), "utf8");
  
  return newEntry;
}

export function deleteGuestbookEntry(id: string): boolean {
  const entries = getGuestbookEntries();
  const filtered = entries.filter((e) => e.id !== id);
  
  if (filtered.length === entries.length) {
    return false;
  }
  
  fs.writeFileSync(guestbookPath, JSON.stringify(filtered, null, 2), "utf8");
  return true;
}