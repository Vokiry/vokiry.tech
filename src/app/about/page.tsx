import Link from "next/link";
import { getProfile } from "@/lib/profile";
import { TerminalWindow } from "@/components/TerminalWindow";

export const dynamic = "force-dynamic";

export default function AboutPage() {
  const profile = getProfile();
  const about = profile?.about || { whoAmI: "", whatIDo: "" };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 gradient-text">About Me</h1>
      
      {/* Terminal whoami */}
      <div className="mb-8 animate-scale-in">
        <TerminalWindow title="~ whoami">
          <pre className="text-[var(--text-primary)] font-mono text-sm">
<span className="text-[var(--section-accent)]">$</span> whoami
vokiry</pre>
        </TerminalWindow>
      </div>

      <div className="space-y-6 stagger-2">
        {/* Who I Am */}
        <section className="terminal-card p-6 animate-slide-up">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-[var(--section-accent)]">~/about/whoami</span>
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            {about.whoAmI || "I'm a full-stack developer passionate about building tools that make developers' lives easier."}
          </p>
        </section>

        {/* What I Do */}
        <section className="terminal-card p-6 animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-[var(--section-accent)]">~/about/whatido</span>
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            {about.whatIDo || "I build web applications, developer tools, and explore the latest in the JavaScript ecosystem."}
          </p>
        </section>

        {/* Connect */}
        <section className="terminal-card p-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-[var(--section-accent)]">~/connect</span>
          </h2>
          <p className="text-[var(--text-secondary)] mb-4">
            Feel free to reach out or check out my work:
          </p>
          <div className="flex gap-4">
            <Link href="/contact" className="text-[var(--section-accent)] hover:underline hover-glow">
              Contact →
            </Link>
            <Link href="/portfolio" className="text-[var(--section-accent)] hover:underline hover-glow">
              Portfolio →
            </Link>
          </div>
        </section>
      </div>

      {/* Navigation breadcrumbs */}
      <div className="mt-12 flex gap-6 animate-fade-in">
        <Link href="/now" className="text-[var(--text-muted)] hover:text-[var(--section-accent)] transition-colors">
          ~/now
        </Link>
        <Link href="/uses" className="text-[var(--text-muted)] hover:text-[var(--section-accent)] transition-colors">
          ~/uses
        </Link>
      </div>
    </div>
  );
}