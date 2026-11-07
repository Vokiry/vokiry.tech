import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default function NotesPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* --------------------------------------------------------------------
          Header
          -------------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 font-mono text-xs text-ctp-subtext0">
          <span className="tui-chip aug-br text-ctp-peach">[ 05 // ГРАФОМАНИЯ ]</span>
          <span className="text-ctp-overlay0">//</span>
          <span>DEV LOG &amp; STREAM NOTES</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-6xl font-bold font-display tracking-tight text-ctp-text">
              ~/графомания
            </h1>
            <p className="text-base text-ctp-subtext0 mt-2 max-w-xl leading-relaxed">
              Мысли вслух, грабли при настройке стримов, истории написания костылей и разборы софта. 
              Пишется искренне и без корпоративной цензуры.
            </p>
          </div>

          <div className="font-mono text-xs text-ctp-overlay1">
            <span>TOTAL: {posts.length} POSTS</span>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          Posts List
          -------------------------------------------------------------------- */}
      <section className="space-y-4">
        {posts.length === 0 ? (
          <div className="panel-sharp aug-br p-8 text-center font-mono text-xs text-ctp-subtext0">
            [ $ ls notes/ — пока пусто. Автор на стриме или кодит новые костыли ]
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="panel-card aug-br p-6 space-y-3 group hover:border-ctp-peach/60 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-ctp-overlay0">
                  <span className="tabular-nums">[{post.date}]</span>
                  <div className="flex items-center gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-ctp-surface1 text-ctp-subtext0 text-[11px]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold font-display text-ctp-text group-hover:text-ctp-peach transition-colors">
                  <Link href={`/notes/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                <p className="text-xs sm:text-sm text-ctp-subtext0 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="pt-2">
                  <Link
                    href={`/notes/${post.slug}`}
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-ctp-peach hover:underline"
                  >
                    Читать заметку →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
