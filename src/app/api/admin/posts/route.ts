import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, createPost, deletePost } from "@/lib/posts";

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get("admin-auth");
  if (cookie?.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = getAllPosts();
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get("admin-auth");
  if (cookie?.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, excerpt, tags, content } = body;

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
  const cookie = request.cookies.get("admin-auth");
  if (cookie?.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Slug required" }, { status: 400 });
  }

  const deleted = deletePost(slug);
  if (deleted) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: "Post not found" }, { status: 404 });
}