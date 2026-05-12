import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const ALLOWED = (process.env.ADMIN_GITHUB_LOGINS || "vokiry")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const login = (session as unknown as { login?: string } | null)?.login?.toLowerCase();
  if (!login || !ALLOWED.includes(login)) redirect("/admin");
  return <>{children}</>;
}
