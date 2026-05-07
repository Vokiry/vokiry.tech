import { NextRequest, NextResponse } from "next/server";
import { getProjects, addProject, updateProject, deleteProject } from "@/lib/projects";

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get("admin-auth");
  if (cookie?.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const projects = getProjects();
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get("admin-auth");
  if (cookie?.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const newProject = addProject({
      title: body.title || "",
      description: body.description || "",
      tech: body.tech || [],
      live: body.live || "",
      github: body.github || "",
      featured: body.featured || false,
      order: body.order || 999,
    });

    return NextResponse.json(newProject);
  } catch {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const cookie = request.cookies.get("admin-auth");
  if (cookie?.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, ...data } = body;
    
    if (!slug) {
      return NextResponse.json({ error: "Slug required" }, { status: 400 });
    }

    const updated = updateProject(slug, data);
    
    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const cookie = request.cookies.get("admin-auth");
  if (cookie?.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    
    if (!slug) {
      return NextResponse.json({ error: "Slug required" }, { status: 400 });
    }

    const success = deleteProject(slug);
    
    if (!success) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}