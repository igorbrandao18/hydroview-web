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
      <CardContent className="!py-2 sm:!py-3">
        <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--muted)] sm:text-[10px]">{label}</p>
        <p className="mt-0.5 font-[family-name:var(--font-display)] text-lg tabular-nums text-[var(--foreground)] sm:mt-1 sm:text-2xl">
          {value}
        </p>
        {hint ? <p className="mt-0.5 text-[10px] text-[var(--muted)] sm:mt-1 sm:text-xs">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
