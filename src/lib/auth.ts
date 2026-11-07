import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { siteConfig } from "./siteConfig";

const ALLOWED_GITHUB_LOGINS = (process.env.ADMIN_GITHUB_LOGINS || siteConfig.author.name)
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET || "development-station-secret-vokiry-v030",
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID || "",
      clientSecret: process.env.AUTH_GITHUB_SECRET || "",
    }),
    Credentials({
      id: "dev-login",
      name: "Локальный вход (Dev)",
      credentials: {
        username: { label: "Username", type: "text" },
      },
      async authorize(credentials) {
        const username =
          (credentials?.username as string)?.trim()?.toLowerCase() ||
          siteConfig.author.name.toLowerCase();

        if (ALLOWED_GITHUB_LOGINS.includes(username)) {
          return {
            id: "dev-admin-1",
            name: username,
            login: username,
            email: `${username}@station.local`,
          };
        }
        return null;
      },
    }),
  ],
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  callbacks: {
    async signIn({ user, profile }) {
      const login =
        (profile?.login as string | undefined)?.toLowerCase() ||
        (user as { login?: string })?.login?.toLowerCase() ||
        (user?.name as string | undefined)?.toLowerCase();

      if (!login) return false;
      return ALLOWED_GITHUB_LOGINS.includes(login);
    },
    async jwt({ token, user, profile }) {
      if (profile?.login) {
        token.login = profile.login as string;
      } else if ((user as { login?: string })?.login) {
        token.login = (user as { login?: string }).login;
      } else if (user?.name) {
        token.login = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.login) {
        (session as { login?: string }).login = token.login as string;
      }
      return session;
    },
  },
  pages: { signIn: "/admin" },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
});

export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  const login = (session as unknown as { login?: string } | null)?.login?.toLowerCase();
  return !!login && ALLOWED_GITHUB_LOGINS.includes(login);
}
