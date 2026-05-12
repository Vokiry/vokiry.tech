import { NextRequest, NextResponse } from "next/server";
import { getProjects, addProject, updateProject, deleteProject } from "@/lib/projects";
import { isAdmin } from "@/lib/auth";

async function guard() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  return NextResponse.json(getProjects());
}

export async function POST(request: NextRequest) {
  const denied = await guard();
  if (denied) return denied;
  try {
    const body = await request.json();
    const project = addProject({
      title: body.title || "",
      description: body.description || "",
      tech: body.tech || [],
      live: body.live || "",
      github: body.github || "",
      featured: !!body.featured,
      order: body.order || 999,
    });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const denied = await guard();
  if (denied) return denied;
  try {
    const { slug, ...data } = await request.json();
    if (!slug) return NextResponse.json({ error: "Slug required" }, { status: 400 });
    const updated = updateProject(slug, data);
    if (!updated) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await guard();
  if (denied) return denied;
  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Slug required" }, { status: 400 });
  return deleteProject(slug)
    ? NextResponse.json({ success: true })
    : NextResponse.json({ error: "Project not found" }, { status: 404 });
}
