import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="code-block mb-6">
          <div className="flex items-center gap-2 mb-3 text-[var(--text-muted)] text-sm">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>vokiry@terminal</span>
          </div>
          <div className="font-mono text-sm">
            <p className="text-red-400 mb-2">Error: 404 - Command not found</p>
            <p className="text-[var(--text-muted)]">The page you're looking for doesn't exist.</p>
            <p className="text-[var(--text-muted)] mt-2">Did you mean:</p>
            <ul className="list-disc list-inside text-[var(--primary)] mt-2 space-y-1">
              <li><Link href="/" className="hover:underline">/home</Link></li>
              <li><Link href="/about" className="hover:underline">/about</Link></li>
              <li><Link href="/blog" className="hover:underline">/blog</Link></li>
              <li><Link href="/utilities" className="hover:underline">/utilities</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="px-4 py-2 rounded-md bg-[var(--primary)] text-[var(--bg-primary)] font-medium hover:bg-[var(--primary-dark)] transition-all hover:scale-105"
          >
            Go Home
          </Link>
          <Link
            href="/blog"
            className="px-4 py-2 rounded-md border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
          >
            Blog
          </Link>
          <Link
            href="/utilities"
            className="px-4 py-2 rounded-md border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
          >
            Utilities
          </Link>
        </div>

        <div className="mt-8 text-center text-[var(--text-muted)] text-sm">
          <p>Or try searching for a command...</p>
        </div>
      </div>
    </div>
  );
}