import type { DashboardAlert } from "@/lib/types";

const styles: Record<
  DashboardAlert["level"],
  { bar: string; badgeBg: string; badgeFg: string }
> = {
  ok: {
    bar: "bg-[var(--alert-ok-strip)]",
    badgeBg: "var(--alert-ok-surface)",
    badgeFg: "var(--alert-ok-fg)",
  },
  warning: {
    bar: "bg-[var(--alert-warning-strip)]",
    badgeBg: "var(--alert-warning-surface)",
    badgeFg: "var(--alert-warning-fg)",
  },
  critical: {
    bar: "bg-[var(--alert-critical-strip)]",
    badgeBg: "var(--alert-critical-surface)",
    badgeFg: "var(--alert-critical-fg)",
  },
};

export function AlertList({ alerts }: { alerts: DashboardAlert[] }) {
  return (
    <ul className="space-y-3">
      {alerts.map((a) => {
        const s = styles[a.level];
        return (
          <li
            key={a.id}
            className="flex gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 sm:gap-4 sm:rounded-xl sm:p-4"
          >
            <span className={`mt-1 h-full w-1 shrink-0 rounded-full ${s.bar}`} aria-hidden />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-medium text-[var(--foreground)]">{a.title}</h3>
                <span
                  className="rounded-full px-2 py-0.5 text-[0.625rem] font-semibold"
                  style={{ backgroundColor: s.badgeBg, color: s.badgeFg }}
                >
                  {a.level === "ok"
                    ? "Informativo"
                    : a.level === "warning"
                      ? "Atenção"
                      : "Crítico"}
                </span>
              </div>
              <p className="mt-1 text-xs text-[var(--muted)] sm:text-sm">{a.message}</p>
              <time className="mt-2 block text-xs text-[var(--muted)]">
                {new Date(a.at).toLocaleString("pt-BR")}
              </time>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
