"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { saasNav } from "@/lib/nav-config";
import type { NavItem } from "@/lib/nav-config";

function NavLink({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isActive =
    item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  if (item.disabled) {
    return (
      <span className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-[var(--sidebar-muted)] opacity-50 cursor-not-allowed">
        {item.label}
        {item.badge && (
          <span className="rounded-full bg-[var(--sidebar-hover)] px-1.5 py-0.5 text-[0.5625rem]">
            {item.badge}
          </span>
        )}
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-fg)]"
          : "text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-fg)]"
      }`}
    >
      {item.label}
    </Link>
  );
}

export function SaasSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { data: session } = useSession();
  const userName = session?.user?.name ?? "Usuário";

  return (
    <div className="flex h-full flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)]">
      <div className="flex h-14 items-center gap-2 border-b border-[var(--sidebar-border)] px-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] text-xs font-bold text-[var(--accent-foreground)]">
          H₂O
        </span>
        <div className="min-w-0 leading-tight">
          <span className="block truncate font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--sidebar-fg)]">
            HydroView
          </span>
          <span className="block truncate text-[0.625rem] text-[var(--sidebar-muted)]">
            Monitoramento de água
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {saasNav.map((section) => (
          <div key={section.title} className="mb-6 last:mb-0">
            <p className="mb-2 px-3 text-[0.625rem] font-semibold uppercase tracking-wider text-[var(--sidebar-muted)]">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.href}>
                  <NavLink item={item} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--sidebar-border)] p-3">
        <div className="rounded-lg bg-[var(--sidebar-hover)]/60 px-3 py-2">
          <p className="text-xs font-medium text-[var(--sidebar-fg)]">{userName}</p>
        </div>
        <button
          type="button"
          onClick={() => { onNavigate?.(); signOut({ callbackUrl: "/login" }); }}
          className="mt-2 block w-full rounded-lg px-3 py-2 text-center text-xs font-medium text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-fg)]"
        >
          Sair
        </button>
      </div>
    </div>
  );
}
