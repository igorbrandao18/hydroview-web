"use client";

import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { saasNav } from "@/lib/nav-config";

function titleFromPath(pathname: string): string {
  let best: { href: string; label: string } | null = null;
  for (const sec of saasNav) {
    for (const item of sec.items) {
      const exact = pathname === item.href;
      const nested = pathname.startsWith(`${item.href}/`);
      if (exact || nested) {
        if (!best || item.href.length > best.href.length) {
          best = item;
        }
      }
    }
  }
  return best?.label ?? "HydroView";
}

type Props = {
  onMenuClick: () => void;
};

export function SaasTopbar({ onMenuClick }: Props) {
  const pathname = usePathname();
  const title = titleFromPath(pathname);
  const { data: session } = useSession();
  const initials = (session?.user?.name ?? "?").slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--surface)]/95 px-4 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--foreground)] lg:hidden"
          aria-label="Abrir menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted)]">
            Residencial Águas Claras
          </p>
          <h1 className="truncate font-[family-name:var(--font-display)] text-lg text-[var(--foreground)]">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden max-w-xs md:block">
          <label htmlFor="saas-search" className="sr-only">
            Buscar
          </label>
          <input
            id="saas-search"
            type="search"
            placeholder="Buscar condomínio, dispositivo…"
            className="w-56 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] lg:w-72"
          />
        </div>
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--muted)] transition hover:text-[var(--foreground)]"
          aria-label="Notificações"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[var(--accent)]" />
        </button>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="hidden h-8 shrink-0 items-center gap-1.5 rounded-full bg-[var(--accent)] px-3 text-xs font-bold text-[var(--accent-foreground)] transition-opacity hover:opacity-90 sm:flex"
          title="Sair"
        >
          {initials}
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>
  );
}
