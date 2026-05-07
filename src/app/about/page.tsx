import Link from "next/link";
import { getProfile } from "@/lib/profile";

export const dynamic = "force-dynamic";

export default function AboutPage() {
  const profile = getProfile();
  const about = profile?.about || { whoAmI: "", whatIDo: "", fursona: { species: "", colors: [] } };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 gradient-text">About Me</h1>
      
      <div className="space-y-6 mb-8">
        <div className="code-block">
          <div className="flex items-center gap-2 mb-2 text-[var(--text-muted)] text-sm">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
            <span>vokiry@terminal</span>
          </div>
          <pre className="text-[var(--text-primary)] font-mono text-sm">
$ whoami
vokiry</pre>
        </div>
      </div>

      <div className="space-y-8">
        <section className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Who I Am</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            {about.whoAmI || "I'm a full-stack developer passionate about building tools that make developers' lives easier."}
          </p>
        </section>

        <section className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">$ cat fursona.txt</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            Species: {about.fursona.species || "Red Panda"}<br/>
            Colors: {about.fursona.colors.join(", ") || "Teal, Cyan, Red"}
          </p>
          <p className="text-[var(--text-muted)] text-sm">
            (Just a subtle reference for those who know ✨)
          </p>
        </section>

        <section className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">What I Do</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            {about.whatIDo || "I build web applications, developer tools, and explore the latest in the JavaScript ecosystem."}
          </p>
        </section>

        <section className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Connect</h2>
          <p className="text-[var(--text-secondary)] mb-4">
            Feel free to reach out or check out my work:
          </p>
          <div className="flex gap-4">
            <Link href="/contact" className="text-[var(--primary)] hover:underline">
              Contact →
            </Link>
            <Link href="/portfolio" className="text-[var(--primary)] hover:underline">
              Portfolio →
            </Link>
          </div>
        </section>
      </div>

      <div className="mt-12 flex gap-6">
        <Link href="/now" className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
          /now
        </Link>
        <Link href="/uses" className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
          /uses
        </Link>
        <Link href="/tails" className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
          /tails
        </Link>
      </div>
    </div>
  );
}