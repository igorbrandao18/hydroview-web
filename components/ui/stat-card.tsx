import type { ReactNode } from "react";
import { Card, CardContent } from "./card";

type Props = {
  label: string;
  value: ReactNode;
  hint?: string;
};

export function StatCard({ label, value, hint }: Props) {
  return (
    <Card>
      <CardContent className="!py-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">{label}</p>
        <p className="mt-1 font-[family-name:var(--font-display)] text-2xl tabular-nums text-[var(--foreground)]">
          {value}
        </p>
        {hint ? <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
