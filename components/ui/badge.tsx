import type { HTMLAttributes } from "react";

type Tone = "neutral" | "success" | "warning" | "critical" | "accent";

const toneClass: Record<Tone, string> = {
  neutral: "bg-[var(--surface-elevated)] text-[var(--muted)] border-[var(--border)]",
  success: "bg-[var(--alert-ok-surface)] text-[var(--alert-ok-fg)] border-transparent",
  warning: "bg-[var(--alert-warning-surface)] text-[var(--alert-warning-fg)] border-transparent",
  critical: "bg-[var(--alert-critical-surface)] text-[var(--alert-critical-fg)] border-transparent",
  accent: "bg-[var(--accent)]/15 text-[var(--accent-deep)] border-transparent",
};

export function Badge({
  tone = "neutral",
  className = "",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide ${toneClass[tone]} ${className}`}
      {...props}
    />
  );
}
