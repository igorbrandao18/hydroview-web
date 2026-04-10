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
    <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--surface)]/95 px-3 backdrop-blur-md sm:h-14 sm:gap-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--foreground)] lg:hidden"
          aria-label="Abrir menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="min-w-0">
          <h1 className="truncate font-[family-name:var(--font-display)] text-base text-[var(--foreground)] sm:text-lg">
            {title}
          </h1>
        </div>
      </div>

      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-[var(--accent)] px-3 text-xs font-bold text-[var(--accent-foreground)] transition-opacity hover:opacity-90"
        title="Sair"
      >
        {initials}
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </header>
  );
}
