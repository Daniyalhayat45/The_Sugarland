"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Login failed.");
      setSubmitting(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <section className="ink-bg flex min-h-screen items-center justify-center px-5">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-3xl bg-cream p-8 shadow-2xl">
        <p className="text-center font-script text-4xl text-plum">The Sugarland</p>
        <h1 className="mt-2 text-center font-display text-lg font-semibold text-ink/70">Owner Dashboard Login</h1>

        <label className="mt-6 block text-sm">
          <span className="mb-1 block font-medium text-ink/80">Email</span>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 outline-none focus:border-gold-deep focus:ring-1 focus:ring-gold-deep"
          />
        </label>
        <label className="mt-4 block text-sm">
          <span className="mb-1 block font-medium text-ink/80">Password</span>
          <input
            name="password"
            type="password"
            required
            className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 outline-none focus:border-gold-deep focus:ring-1 focus:ring-gold-deep"
          />
        </label>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-full bg-ink py-2.5 text-sm font-semibold uppercase tracking-widest text-cream transition hover:bg-plum disabled:opacity-60"
        >
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </section>
  );
}
