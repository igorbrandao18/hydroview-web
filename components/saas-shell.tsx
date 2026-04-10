"use client";

import { useState } from "react";
import { SaasSidebar } from "./saas-sidebar";
import { SaasTopbar } from "./saas-topbar";

export function SaasShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background-muted)]">
      {/* Mobile overlay */}
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[var(--overlay-scrim)] lg:hidden"
          aria-label="Fechar menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[75vw] max-w-64 transform transition-transform duration-200 ease-out lg:static lg:z-0 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <SaasSidebar onNavigate={() => setMobileOpen(false)} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <SaasTopbar onMenuClick={() => setMobileOpen(true)} />
        <div className="flex-1 overflow-auto p-2 sm:p-3">{children}</div>
      </div>
    </div>
  );
}
