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

export default async function NotePage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-4 font-mono">
        <h1 className="text-2xl font-bold font-display text-ctp-red">[404] Заметка не найдена</h1>
        <p className="text-sm text-ctp-subtext0">Возможно, автор переименовал файл или снес костыль.</p>
        <Link href="/notes" className="text-xs text-ctp-mauve hover:underline inline-block">
          ← Вернуться в графоманию
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/notes"
          className="aug-br inline-flex items-center gap-2 px-3 py-1 font-mono text-xs border border-[var(--border)] text-ctp-subtext0 hover:text-ctp-mauve hover:border-ctp-mauve transition-colors"
        >
          ← ~/графомания
        </Link>
      </div>

      <article className="space-y-6">
        <header className="panel-card aug-br p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-ctp-overlay0">
            <span className="tabular-nums">[{post.date}]</span>
            <span>//</span>
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-ctp-surface1 text-ctp-mauve text-[11px]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-display text-ctp-text leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-base text-ctp-subtext0 border-l-2 border-ctp-mauve pl-4 italic">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Content Body */}
        <div className="panel-sharp aug-br p-6 sm:p-8">
          <MarkdownContent content={post.content} />
        </div>
      </article>

      {/* Discussion / Giscus */}
      <section className="panel-card aug-br p-6">
        <div className="font-mono text-xs text-ctp-overlay0 mb-4 pb-2 border-b border-[var(--border-subtle)]">
          // ОБСУЖДЕНИЕ В ЧАТЕ (GISCUS / GITHUB)
        </div>
        <Giscus />
      </section>

      {/* Footer Navigation */}
      <div className="pt-4 flex items-center justify-between font-mono text-xs">
        <Link href="/notes" className="text-ctp-mauve hover:underline">
          ← Все заметки
        </Link>
        <Link href="/wall" className="text-ctp-teal hover:underline">
          Черкануть на заборе →
        </Link>
      </div>
    </div>
  );
}
