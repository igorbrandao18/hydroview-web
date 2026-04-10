"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      username: form.get("username") as string,
      password: form.get("password") as string,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Usuário ou senha incorretos.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="username"
          className="mb-1 block text-xs font-medium text-[var(--muted)]"
        >
          Usuário
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          autoComplete="username"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-xs font-medium text-[var(--muted)]"
        >
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
      </div>

      {error && (
        <p className="text-sm font-medium text-[var(--alert-critical-fg)]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
