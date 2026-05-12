import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

const ALLOWED_GITHUB_LOGINS = (process.env.ADMIN_GITHUB_LOGINS || "vokiry")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  callbacks: {
    async signIn({ profile }) {
      const login = (profile?.login as string | undefined)?.toLowerCase();
      if (!login) return false;
      return ALLOWED_GITHUB_LOGINS.includes(login);
    },
    async jwt({ token, profile }) {
      if (profile?.login) token.login = profile.login as string;
      return token;
    },
    async session({ session, token }) {
      if (token.login) (session as { login?: string }).login = token.login as string;
      return session;
    },
  },
  pages: { signIn: "/admin" },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-authjs.session-token" : "authjs.session-token",
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
