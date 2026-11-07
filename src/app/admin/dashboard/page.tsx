"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

interface Project {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  live: string;
  github: string;
  featured: boolean;
  order: number;
}

interface Skill {
  category: string;
  proficiency: string;
  items: string[];
}

interface Profile {
  about: {
    whoAmI: string;
    whatIDo: string;
  };
  now: { item: string; description: string }[];
  uses: { hardware: string[]; software: string[] };
  tails: { status: string; location: string; tailLength: number; energy: number; napsToday: number; bamboo: number };
  social: { github: string; twitter: string; telegram: string; email: string };
}

type Tab = "posts" | "projects" | "skills" | "profile";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("posts");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [posts, setPosts] = useState<Post[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [showPostForm, setShowPostForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);

  const [postForm, setPostForm] = useState({ title: "", excerpt: "", tags: "", content: "" });
  const [projectForm, setProjectForm] = useState({ title: "", description: "", tech: "", live: "", github: "", featured: false });
  const [skillForm, setSkillForm] = useState({ category: "", proficiency: "Intermediate", items: "" });

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchPosts(), fetchProjects(), fetchSkills(), fetchProfile()]);
    setLoading(false);
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/admin/posts");
      if (res.ok) setPosts(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      if (res.ok) setProjects(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/admin/skills");
      if (res.ok) setSkills(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/admin/profile");
      if (res.ok) setProfile(await res.json());
    } catch (e) { console.error(e); }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const resetProjectForm = () => {
    setProjectForm({ title: "", description: "", tech: "", live: "", github: "", featured: false });
    setEditingProject(null);
  };

  const resetSkillForm = () => {
    setSkillForm({ category: "", proficiency: "Intermediate", items: "" });
    setEditingSkill(null);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...postForm, tags: postForm.tags.split(",").map((t) => t.trim()).filter(Boolean) }),
      });
      if (res.ok) {
        showMessage("Post created!");
        setPostForm({ title: "", excerpt: "", tags: "", content: "" });
        setShowPostForm(false);
        fetchPosts();
      } else {
        showMessage("Failed to create post");
      }
    } catch { showMessage("Error creating post"); }
    setSaving(false);
  };

  const handleDeletePost = async (slug: string) => {
    if (!confirm("Delete post?")) return;
    try {
      const res = await fetch(`/api/admin/posts?slug=${slug}`, { method: "DELETE" });
      if (res.ok) fetchPosts();
    } catch (err) { console.error(err); }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { ...projectForm, tech: projectForm.tech.split(",").map((t) => t.trim()).filter(Boolean) };
      
      const res = await fetch("/api/admin/projects", {
        method: editingProject ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: editingProject ? JSON.stringify({ ...body, slug: editingProject.slug }) : JSON.stringify(body),
      });
      
      if (res.ok) {
        showMessage(editingProject ? "Project updated!" : "Project created!");
        resetProjectForm();
        setShowProjectForm(false);
        fetchProjects();
      } else {
        showMessage("Failed to save project");
      }
    } catch { showMessage("Error saving project"); }
    setSaving(false);
  };

  const handleDeleteProject = async (slug: string) => {
    if (!confirm("Delete project?")) return;
    try {
      const res = await fetch(`/api/admin/projects?slug=${slug}`, { method: "DELETE" });
      if (res.ok) fetchProjects();
    } catch (err) { console.error(err); }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      tech: project.tech.join(", "),
      live: project.live,
      github: project.github,
      featured: project.featured,
    });
    setShowProjectForm(true);
  };

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { 
        category: skillForm.category, 
        proficiency: skillForm.proficiency,
        items: skillForm.items.split(",").map((t) => t.trim()).filter(Boolean)
      };

      const res = await fetch("/api/admin/skills", {
        method: editingSkill ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: editingSkill ? JSON.stringify({ ...body, originalCategory: editingSkill.category }) : JSON.stringify(body),
      });
      
      if (res.ok) {
        showMessage(editingSkill ? "Skill updated!" : "Skill created!");
        resetSkillForm();
        setShowSkillForm(false);
        fetchSkills();
      } else {
        showMessage("Failed to save skill");
      }
    } catch { showMessage("Error saving skill"); }
    setSaving(false);
  };

  const handleDeleteSkill = async (category: string) => {
    if (!confirm("Delete this skill category?")) return;
    try {
      const res = await fetch(`/api/admin/skills?category=${encodeURIComponent(category)}`, { method: "DELETE" });
      if (res.ok) fetchSkills();
    } catch (err) { console.error(err); }
  };

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setSkillForm({
      category: skill.category,
      proficiency: skill.proficiency,
      items: skill.items.join(", "),
    });
    setShowSkillForm(true);
  };

  const handleUpdateProfile = async (section: string, data: any) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/profile/section?section=" + section, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data }),
      });
      if (res.ok) {
        showMessage(section + " updated!");
        fetchProfile();
      } else {
        showMessage("Error updating " + section);
      }
    } catch { showMessage("Error updating profile"); }
    setSaving(false);
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-12"><p className="text-[var(--text-muted)]">Loading...</p></div>;
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "posts", label: `Posts (${posts.length})` },
    { id: "projects", label: `Projects (${projects.length})` },
    { id: "skills", label: `Skills (${skills.length})` },
    { id: "profile", label: "Profile" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-ctp-peach font-bold">&gt;_ STATION_ADMIN</span>
          <span className="text-ctp-overlay0">// DASHBOARD</span>
        </div>
        <button onClick={handleLogout} className="text-xs text-ctp-red hover:underline cursor-pointer">
          [ Выйти из системы ]
        </button>
      </div>

      <nav className="flex gap-4 font-mono text-xs">
        <Link href="/" className="text-ctp-mauve hover:underline">← Вернуться на базу</Link>
      </nav>

      {message && (
        <div className={`p-3 font-mono text-xs aug-br ${message.includes("!") ? "bg-ctp-green/20 text-ctp-green border border-ctp-green/40" : "bg-ctp-red/20 text-ctp-red border border-ctp-red/40"}`}>
          {message}
        </div>
      )}

      <div className="flex flex-wrap gap-2 border-b border-[var(--border)] font-mono text-xs pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 aug-br transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-ctp-surface1 border border-ctp-mauve text-ctp-mauve font-semibold"
                : "border border-transparent text-ctp-subtext0 hover:text-ctp-text hover:bg-ctp-surface0"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "posts" && (
        <div className="panel-card aug-br p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] font-mono text-xs">
            <h2 className="text-base font-bold font-display text-ctp-text">Статьи блога (MDX)</h2>
            <button
              onClick={() => { setShowPostForm(!showPostForm); if (!showPostForm) setPostForm({ title: "", excerpt: "", tags: "", content: "" }); }}
              className="px-3 py-1 aug-br bg-ctp-mauve text-ctp-base font-mono text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity"
            >
              {showPostForm ? "Отмена" : "+ Новая статья"}
            </button>
          </div>

          {showPostForm && (
            <form onSubmit={handleCreatePost} className="space-y-4 mb-6 pt-4 border-t border-[var(--border)]">
              <div>
                <label className="block text-sm mb-1 text-[var(--text-secondary)]">Title</label>
                <input type="text" value={postForm.title} onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                  className="w-full p-2 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]" required />
              </div>
              <div>
                <label className="block text-sm mb-1 text-[var(--text-secondary)]">Excerpt</label>
                <input type="text" value={postForm.excerpt} onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })}
                  className="w-full p-2 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-[var(--text-secondary)]">Tags (comma separated)</label>
                <input type="text" value={postForm.tags} onChange={(e) => setPostForm({ ...postForm, tags: e.target.value })}
                  className="w-full p-2 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]" placeholder="Next.js, Tutorial" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-[var(--text-secondary)]">Content (Markdown)</label>
                <textarea value={postForm.content} onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                  className="w-full h-40 p-2 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] font-mono text-sm" required />
              </div>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-[var(--primary)] text-[var(--bg-primary)] disabled:opacity-50">
                {saving ? "Saving..." : "Save Post"}
              </button>
            </form>
          )}

          {posts.length === 0 ? (
            <p className="text-[var(--text-muted)]">No posts yet.</p>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div key={post.slug} className="flex items-center justify-between p-3 rounded bg-[var(--bg-secondary)]">
                  <div>
                    <h3 className="font-medium">{post.title}</h3>
                    <p className="text-sm text-[var(--text-muted)]">{post.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/notes/${post.slug}`} className="text-sm text-ctp-mauve hover:underline font-mono">View ↗</Link>
                    <button onClick={() => handleDeletePost(post.slug)} className="text-sm text-red-500 hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "projects" && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Projects</h2>
            <button onClick={() => { setShowProjectForm(!showProjectForm); if (!showProjectForm) resetProjectForm(); }} className="px-4 py-2 rounded bg-[var(--primary)] text-[var(--bg-primary)] text-sm">
              {showProjectForm ? "Cancel" : "New Project"}
            </button>
          </div>

          {showProjectForm && (
            <form onSubmit={handleCreateProject} className="space-y-4 mb-6 pt-4 border-t border-[var(--border)]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{editingProject ? "Edit Project" : "Create New Project"}</h3>
                {editingProject && (
                  <button type="button" onClick={resetProjectForm} className="text-sm text-[var(--text-muted)] hover:text-[var(--primary)]">
                    Cancel edit
                  </button>
                )}
              </div>
              <div>
                <label className="block text-sm mb-1 text-[var(--text-secondary)]">Title</label>
                <input type="text" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full p-2 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]" required />
              </div>
              <div>
                <label className="block text-sm mb-1 text-[var(--text-secondary)]">Description</label>
                <textarea value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full h-24 p-2 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-[var(--text-secondary)]">Tech Stack (comma separated)</label>
                <input type="text" value={projectForm.tech} onChange={(e) => setProjectForm({ ...projectForm, tech: e.target.value })}
                  className="w-full p-2 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]" placeholder="React, Next.js, TypeScript" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-[var(--text-secondary)]">Live URL</label>
                  <input type="text" value={projectForm.live} onChange={(e) => setProjectForm({ ...projectForm, live: e.target.value })}
                    className="w-full p-2 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-[var(--text-secondary)]">GitHub URL</label>
                  <input type="text" value={projectForm.github} onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })}
                    className="w-full p-2 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" checked={projectForm.featured} onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })} />
                <label htmlFor="featured" className="text-sm text-[var(--text-secondary)]">Featured (show on home)</label>
              </div>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-[var(--primary)] text-[var(--bg-primary)] disabled:opacity-50">
                {saving ? "Saving..." : editingProject ? "Update Project" : "Create Project"}
              </button>
            </form>
          )}

          {projects.length === 0 ? (
            <p className="text-[var(--text-muted)]">No projects yet.</p>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project.slug} className="flex items-center justify-between p-3 rounded bg-[var(--bg-secondary)]">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${project.featured ? "bg-[var(--primary)]" : "bg-[var(--text-muted)]"}`}></span>
                    <div>
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="text-sm text-[var(--text-muted)]">{project.tech.join(", ")}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleEditProject(project)} className="text-sm text-[var(--primary)] hover:underline">Edit</button>
                    <button onClick={() => handleDeleteProject(project.slug)} className="text-sm text-red-500 hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "skills" && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Skills</h2>
            <button onClick={() => { setShowSkillForm(!showSkillForm); if (!showSkillForm) resetSkillForm(); }} className="px-4 py-2 rounded bg-[var(--primary)] text-[var(--bg-primary)] text-sm">
              {showSkillForm ? "Cancel" : "Add Category"}
            </button>
          </div>

          {showSkillForm && (
            <form onSubmit={handleCreateSkill} className="space-y-4 mb-6 pt-4 border-t border-[var(--border)]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{editingSkill ? "Edit Skill" : "Add New Skill Category"}</h3>
                {editingSkill && (
                  <button type="button" onClick={resetSkillForm} className="text-sm text-[var(--text-muted)] hover:text-[var(--primary)]">
                    Cancel edit
                  </button>
                )}
              </div>
              <div>
                <label className="block text-sm mb-1 text-[var(--text-secondary)]">Category Name</label>
                <input type="text" value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                  className="w-full p-2 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]" required placeholder="Frontend" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-[var(--text-secondary)]">Proficiency</label>
                <select value={skillForm.proficiency} onChange={(e) => setSkillForm({ ...skillForm, proficiency: e.target.value })}
                  className="w-full p-2 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]">
                  <option value="Expert">Expert</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Beginner">Beginner</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1 text-[var(--text-secondary)]">Skills (comma separated)</label>
                <input type="text" value={skillForm.items} onChange={(e) => setSkillForm({ ...skillForm, items: e.target.value })}
                  className="w-full p-2 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]" placeholder="React, Next.js, TypeScript" />
              </div>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-[var(--primary)] text-[var(--bg-primary)] disabled:opacity-50">
                {saving ? "Saving..." : editingSkill ? "Update Skill" : "Create Skill"}
              </button>
            </form>
          )}

          {skills.length === 0 ? (
            <p className="text-[var(--text-muted)]">No skills yet.</p>
          ) : (
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.category} className="p-4 rounded bg-[var(--bg-secondary)]">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-medium">{skill.category}</h3>
                      <p className="text-sm text-[var(--text-muted)]">{skill.proficiency}</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => handleEditSkill(skill)} className="text-sm text-[var(--primary)] hover:underline">Edit</button>
                      <button onClick={() => handleDeleteSkill(skill.category)} className="text-sm text-red-500 hover:underline">Delete</button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skill.items.map((item) => (
                      <span key={item} className="px-2 py-1 text-xs rounded bg-[var(--bg-card)] text-[var(--text-secondary)]">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "profile" && profile && (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">About Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-[var(--text-secondary)]">Who I Am</label>
                <textarea value={profile.about.whoAmI} onChange={(e) => setProfile({...profile, about: {...profile.about, whoAmI: e.target.value}})}
                  className="w-full h-24 p-2 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-[var(--text-secondary)]">What I Do</label>
                <textarea value={profile.about.whatIDo} onChange={(e) => setProfile({...profile, about: {...profile.about, whatIDo: e.target.value}})}
                  className="w-full h-24 p-2 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]" />
              </div>
              <button onClick={() => handleUpdateProfile("about", profile.about)} disabled={saving} className="px-4 py-2 rounded bg-[var(--primary)] text-[var(--bg-primary)] disabled:opacity-50">
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Social Links</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-[var(--text-secondary)]">GitHub</label>
                <input type="text" value={profile.social.github} onChange={(e) => setProfile({...profile, social: {...profile.social, github: e.target.value}})}
                  className="w-full p-2 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-[var(--text-secondary)]">Twitter</label>
                <input type="text" value={profile.social.twitter} onChange={(e) => setProfile({...profile, social: {...profile.social, twitter: e.target.value}})}
                  className="w-full p-2 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-[var(--text-secondary)]">Telegram</label>
                <input type="text" value={profile.social.telegram} onChange={(e) => setProfile({...profile, social: {...profile.social, telegram: e.target.value}})}
                  className="w-full p-2 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-[var(--text-secondary)]">Email</label>
                <input type="text" value={profile.social.email} onChange={(e) => setProfile({...profile, social: {...profile.social, email: e.target.value}})}
                  className="w-full p-2 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]" />
              </div>
              <button onClick={() => handleUpdateProfile("social", profile.social)} disabled={saving} className="px-4 py-2 rounded bg-[var(--primary)] text-[var(--bg-primary)] disabled:opacity-50">
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Uses - Hardware</h2>
            <div className="space-y-4">
              <textarea value={profile.uses.hardware.join("\n")} onChange={(e) => setProfile({...profile, uses: {...profile.uses, hardware: e.target.value.split("\n").filter(Boolean)}})}
                className="w-full h-32 p-2 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] font-mono text-sm" placeholder="One item per line"></textarea>
              <button onClick={() => handleUpdateProfile("uses", profile.uses)} disabled={saving} className="px-4 py-2 rounded bg-[var(--primary)] text-[var(--bg-primary)] disabled:opacity-50">
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Uses - Software</h2>
            <div className="space-y-4">
              <textarea value={profile.uses.software.join("\n")} onChange={(e) => setProfile({...profile, uses: {...profile.uses, software: e.target.value.split("\n").filter(Boolean)}})}
                className="w-full h-32 p-2 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] font-mono text-sm" placeholder="One item per line"></textarea>
              <button onClick={() => handleUpdateProfile("uses", profile.uses)} disabled={saving} className="px-4 py-2 rounded bg-[var(--primary)] text-[var(--bg-primary)] disabled:opacity-50">
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Tails Stats</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-[var(--text-secondary)]">Status</label>
                <input type="text" value={profile.tails.status} onChange={(e) => setProfile({...profile, tails: {...profile.tails, status: e.target.value}})}
                  className="w-full p-2 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-[var(--text-secondary)]">Location</label>
                <input type="text" value={profile.tails.location} onChange={(e) => setProfile({...profile, tails: {...profile.tails, location: e.target.value}})}
                  className="w-full p-2 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-[var(--text-secondary)]">Tail Length %</label>
                  <input type="number" value={profile.tails.tailLength} onChange={(e) => setProfile({...profile, tails: {...profile.tails, tailLength: parseInt(e.target.value) || 0}})}
                    className="w-full p-2 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-[var(--text-secondary)]">Energy %</label>
                  <input type="number" value={profile.tails.energy} onChange={(e) => setProfile({...profile, tails: {...profile.tails, energy: parseInt(e.target.value) || 0}})}
                    className="w-full p-2 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-[var(--text-secondary)]">Naps Today</label>
                  <input type="number" value={profile.tails.napsToday} onChange={(e) => setProfile({...profile, tails: {...profile.tails, napsToday: parseInt(e.target.value) || 0}})}
                    className="w-full p-2 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-[var(--text-secondary)]">Bamboo (sticks eaten)</label>
                  <input type="number" value={profile.tails.bamboo} onChange={(e) => setProfile({...profile, tails: {...profile.tails, bamboo: parseInt(e.target.value) || 0}})}
                    className="w-full p-2 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]" />
                </div>
              </div>
              <button onClick={() => handleUpdateProfile("tails", profile.tails)} disabled={saving} className="px-4 py-2 rounded bg-[var(--primary)] text-[var(--bg-primary)] disabled:opacity-50">
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}