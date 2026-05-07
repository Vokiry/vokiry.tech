import fs from "fs";
import path from "path";

const skillsPath = path.join(process.cwd(), "src/content/skills.json");

export type ProficiencyLevel = "Expert" | "Advanced" | "Intermediate" | "Beginner";

export interface Skill {
  category: string;
  proficiency: ProficiencyLevel;
  items: string[];
}

export function getSkills(): Skill[] {
  if (!fs.existsSync(skillsPath)) {
    return [];
  }
  try {
    const data = fs.readFileSync(skillsPath, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function getSkillsByCategory(category: string): Skill | undefined {
  return getSkills().find((s) => s.category === category);
}

export function addSkill(data: Skill): Skill {
  const skills = getSkills();
  
  if (skills.some((s) => s.category === data.category)) {
    return updateSkill(data.category, data) as Skill;
  }

  skills.push(data);
  fs.writeFileSync(skillsPath, JSON.stringify(skills, null, 2), "utf8");

  return data;
}

export function updateSkill(category: string, data: Partial<Skill>): Skill | null {
  const skills = getSkills();
  const index = skills.findIndex((s) => s.category === category);
  
  if (index === -1) {
    return null;
  }

  skills[index] = { ...skills[index], ...data };
  fs.writeFileSync(skillsPath, JSON.stringify(skills, null, 2), "utf8");

  return skills[index];
}

export function deleteSkill(category: string): boolean {
  const skills = getSkills();
  const filtered = skills.filter((s) => s.category !== category);
  
  if (filtered.length === skills.length) {
    return false;
  }
  
  fs.writeFileSync(skillsPath, JSON.stringify(filtered, null, 2), "utf8");
  return true;
}