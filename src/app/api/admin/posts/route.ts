import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, createPost, deletePost } from "@/lib/posts";
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
  return NextResponse.json(getAllPosts());
}

export async function POST(request: NextRequest) {
  const denied = await guard();
  if (denied) return denied;
  try {
    const { title, excerpt, tags, content } = await request.json();
    if (!title || !content) {
      return NextResponse.json({ error: "Title and content required" }, { status: 400 });
    }
    const post = createPost({
      title,
      excerpt: excerpt || "",
      tags: tags || [],
      content,
      date: new Date().toISOString().split("T")[0],
    });
    return NextResponse.json(post);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await guard();
  if (denied) return denied;
  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Slug required" }, { status: 400 });
  return deletePost(slug)
    ? NextResponse.json({ success: true })
    : NextResponse.json({ error: "Post not found" }, { status: 404 });
}
