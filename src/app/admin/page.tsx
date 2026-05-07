"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PASSWORD = "Vokiry_SHkiper.758";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      document.cookie = "admin-auth=true; path=/; max-age=3600";
      router.push("/admin/dashboard");
    } else {
      setError(true);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 gradient-text">Admin Login</h1>
      
      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            className="w-full p-3 rounded-md bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none"
            placeholder="Enter password..."
          />
          {error && (
            <p className="text-red-500 text-sm mt-2">Incorrect password</p>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full py-3 rounded-md bg-[var(--primary)] text-[var(--bg-primary)] font-medium hover:bg-[var(--primary-dark)] transition-colors"
        >
          Login
        </button>
      </form>

      <p className="text-[var(--text-muted)] text-sm mt-4 text-center">
        <a href="/" className="hover:text-[var(--primary)]">← Back to home</a>
      </p>
    </div>
  );
}