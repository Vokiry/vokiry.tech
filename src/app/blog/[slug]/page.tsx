import Link from "next/link";
import { getPost, getAllPosts } from "@/lib/posts";
import { Giscus } from "@/components/Giscus";
import { MarkdownContent } from "@/components/MarkdownContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <Link href="/blog" className="text-[var(--primary)] hover:underline">
          ← Back to blog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/blog" className="text-[var(--text-muted)] hover:text-[var(--primary)] text-sm">
        ← Back to blog
      </Link>

      <article className="mt-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <time className="text-sm text-[var(--text-muted)]">{post.date}</time>
            {post.tags.length > 0 && (
              <>
                <span className="text-[var(--text-muted)]">·</span>
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg text-[var(--text-secondary)] mt-4">
              {post.excerpt}
            </p>
          )}
        </header>

        <MarkdownContent content={post.content} />
      </article>

      <Giscus />

      <div className="mt-8 pt-8 border-t border-[var(--border)]">
        <Link href="/blog" className="text-[var(--primary)] hover:underline">
          ← Back to all posts
        </Link>
      </div>
    </div>
  );
}