import fs from "fs";
import path from "path";

const projectsPath = path.join(process.cwd(), "src/content/projects.json");

export interface Project {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  live: string;
  github: string;
  featured: boolean;
  order: number;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getProjects(): Project[] {
  if (!fs.existsSync(projectsPath)) {
    return [];
  }
  try {
    const data = fs.readFileSync(projectsPath, "utf8");
    const projects = JSON.parse(data);
    return projects.sort((a: Project, b: Project) => a.order - b.order);
  } catch {
    return [];
  }
}

export function getFeaturedProjects(): Project[] {
  return getProjects().filter((p) => p.featured).slice(0, 3);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function addProject(data: Omit<Project, "slug">): Project {
  const projects = getProjects();
  
  const newProject: Project = {
    ...data,
    slug: generateSlug(data.title),
  };

  if (projects.some((p) => p.slug === newProject.slug)) {
    newProject.slug = `${newProject.slug}-${Date.now()}`;
  }

  projects.push(newProject);
  fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2), "utf8");

  return newProject;
}

export function updateProject(slug: string, data: Partial<Project>): Project | null {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  
  if (index === -1) {
    return null;
  }

  projects[index] = { ...projects[index], ...data };
  fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2), "utf8");

  return projects[index];
}

export function deleteProject(slug: string): boolean {
  const projects = getProjects();
  const filtered = projects.filter((p) => p.slug !== slug);
  
  if (filtered.length === projects.length) {
    return false;
  }
  
  fs.writeFileSync(projectsPath, JSON.stringify(filtered, null, 2), "utf8");
  return true;
}

export function reorderProjects(slugs: string[]): void {
  const projects = getProjects();
  
  slugs.forEach((slug, index) => {
    const project = projects.find((p) => p.slug === slug);
    if (project) {
      project.order = index + 1;
    }
  });

  fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2), "utf8");
}