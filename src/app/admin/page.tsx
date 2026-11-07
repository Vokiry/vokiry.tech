import { signIn, auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export default async function AdminLogin() {
  const session = await auth();
  if (session) redirect("/admin/dashboard");

  const hasGitHubOAuth = Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET);
  const isDev = process.env.NODE_ENV !== "production";

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="panel-sharp aug-br p-6 sm:p-8 space-y-6 bg-[var(--bg-secondary)] border border-[var(--border)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] font-mono text-xs">
          <span className="text-ctp-peach font-bold">// ВХОД В ПАНЕЛЬ УПРАВЛЕНИЯ</span>
          <span className="text-ctp-overlay0">[RESTRICTED]</span>
        </div>

        <div className="space-y-1 font-mono">
          <h1 className="text-2xl font-bold font-display text-ctp-text">
            {siteConfig.author.name}@station
          </h1>
          <p className="text-xs text-ctp-subtext0">
            Доступ только для доверенных аккаунтов ({siteConfig.author.name}).
          </p>
        </div>

        {/* Warning if GitHub OAuth is missing */}
        {!hasGitHubOAuth && (
          <div className="p-3 bg-ctp-peach/10 border border-ctp-peach/30 aug-br font-mono text-xs space-y-2 text-ctp-subtext0">
            <div className="text-ctp-peach font-bold flex items-center gap-1.5">
              <span>⚠</span>
              <span>GitHub OAuth не настроен локально</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              В <code className="text-ctp-text font-bold">.env.local</code> не указан <code className="text-ctp-text">AUTH_GITHUB_ID</code>, 
              поэтому гитхаб отдаёт 404 (client_id=undefined).
            </p>
            <div className="pt-1 text-[11px] text-ctp-overlay1 border-t border-ctp-peach/20 space-y-1">
              <div>Для настройки GitHub OAuth создайте приложение в GitHub:</div>
              <div>• Homepage: <span className="text-ctp-text">http://localhost:3000</span></div>
              <div>• Callback: <span className="text-ctp-text">http://localhost:3000/api/auth/callback/github</span></div>
            </div>
          </div>
        )}

        {/* Action Forms */}
        <div className="space-y-3">
          {/* Local Dev Login (available in dev or when OAuth is unconfigured) */}
          {(isDev || !hasGitHubOAuth) && (
            <form
              action={async () => {
                "use server";
                await signIn("dev-login", {
                  username: siteConfig.author.name,
                  redirectTo: "/admin/dashboard",
                });
              }}
            >
              <button
                type="submit"
                className="w-full py-3 px-4 aug-br bg-ctp-mauve text-ctp-base font-mono text-xs font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>⚡ Войти локально как {siteConfig.author.name} (Dev-вход)</span>
              </button>
            </form>
          )}

          {/* GitHub OAuth Button */}
          {hasGitHubOAuth ? (
            <form
              action={async () => {
                "use server";
                await signIn("github", { redirectTo: "/admin/dashboard" });
              }}
            >
              <button
                type="submit"
                className="w-full py-2.5 px-4 aug-br border border-[var(--border)] bg-ctp-surface0 text-ctp-text font-mono text-xs font-semibold hover:border-ctp-mauve hover:text-ctp-mauve transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                <span>Войти через GitHub OAuth</span>
              </button>
            </form>
          ) : (
            <div className="text-center font-mono text-[11px] text-ctp-overlay0">
              [ GitHub OAuth отключён до заполнения AUTH_GITHUB_ID в .env.local ]
            </div>
          )}
        </div>

        <div className="pt-2 text-center border-t border-[var(--border-subtle)]">
          <Link href="/" className="font-mono text-xs text-ctp-overlay1 hover:text-ctp-mauve">
            ← Вернуться на базу
          </Link>
        </div>
      </div>
    </div>
  );
}
