import { NextRequest, NextResponse } from "next/server";
import { getSkills, addSkill, updateSkill, deleteSkill, Skill } from "@/lib/skills";
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
  return NextResponse.json(getSkills());
}

export async function POST(request: NextRequest) {
  const denied = await guard();
  if (denied) return denied;
  try {
    const body = await request.json();
    if (body.originalCategory && body.originalCategory !== body.category) {
      deleteSkill(body.originalCategory);
    }
    const skill: Skill = {
      category: body.category || "",
      proficiency: body.proficiency || "Intermediate",
      items: body.items || [],
    };
    return NextResponse.json(addSkill(skill));
  } catch {
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const denied = await guard();
  if (denied) return denied;
  try {
    const { originalCategory, ...data } = await request.json();
    if (!originalCategory) return NextResponse.json({ error: "Original category required" }, { status: 400 });
    const updated = updateSkill(originalCategory, data);
    if (!updated) return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await guard();
  if (denied) return denied;
  const category = new URL(request.url).searchParams.get("category");
  if (!category) return NextResponse.json({ error: "Category required" }, { status: 400 });
  return deleteSkill(category)
    ? NextResponse.json({ success: true })
    : NextResponse.json({ error: "Skill not found" }, { status: 404 });
}
