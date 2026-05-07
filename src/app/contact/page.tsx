import { getProfile } from "@/lib/profile";

export const dynamic = "force-dynamic";

export default function ContactPage() {
  const profile = getProfile();
  const social = profile?.social || { github: "", twitter: "", linkedin: "", email: "" };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 gradient-text">Contact</h1>

      <div className="glass-card p-8">
        <p className="text-[var(--text-secondary)] mb-8">
          Feel free to reach out through any of these channels:
        </p>

        <div className="space-y-4">
          {social.email && (
            <a
              href={`mailto:${social.email}`}
              className="block p-4 rounded-md bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] transition-colors"
            >
              <span className="text-[var(--text-muted)] text-sm">Email</span>
              <p className="text-[var(--primary)]">{social.email}</p>
            </a>
          )}

          {social.github && (
            <a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-md bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] transition-colors"
            >
              <span className="text-[var(--text-muted)] text-sm">GitHub</span>
              <p className="text-[var(--primary)]">{social.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}</p>
            </a>
          )}

          {social.twitter && (
            <a
              href={social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-md bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] transition-colors"
            >
              <span className="text-[var(--text-muted)] text-sm">Twitter / X</span>
              <p className="text-[var(--primary)]">{social.twitter.replace(/^https?:\/\/(www\.)?twitter\.com\//, "")}</p>
            </a>
          )}

          {social.linkedin && (
            <a
              href={social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-md bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] transition-colors"
            >
              <span className="text-[var(--text-muted)] text-sm">LinkedIn</span>
              <p className="text-[var(--primary)]">{social.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}</p>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}