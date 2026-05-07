import { NextRequest, NextResponse } from "next/server";
import { getSkills, addSkill, updateSkill, deleteSkill, Skill } from "@/lib/skills";

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get("admin-auth");
  if (cookie?.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const skills = getSkills();
    return NextResponse.json(skills);
  } catch {
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get("admin-auth");
  if (cookie?.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    if (body.originalCategory && body.originalCategory !== body.category) {
      deleteSkill(body.originalCategory);
    }
    
    const newSkill: Skill = {
      category: body.category || "",
      proficiency: body.proficiency || "Intermediate",
      items: body.items || [],
    };

    const result = addSkill(newSkill);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const cookie = request.cookies.get("admin-auth");
  if (cookie?.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { originalCategory, ...data } = body;
    
    if (!originalCategory) {
      return NextResponse.json({ error: "Original category required" }, { status: 400 });
    }

    const updated = updateSkill(originalCategory, data);
    
    if (!updated) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const cookie = request.cookies.get("admin-auth");
  if (cookie?.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    
    if (!category) {
      return NextResponse.json({ error: "Category required" }, { status: 400 });
    }

    const success = deleteSkill(category);
    
    if (!success) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}