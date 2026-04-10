"use client";

import { useId } from "react";

type Props = {
  percent: number;
  label: string;
  online: boolean;
};

export function LevelRing({ percent, label, online }: Props) {
  const gid = useId().replace(/:/g, "");
  const p = Math.min(100, Math.max(0, percent));
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (p / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1 sm:gap-2">
      <div className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28">
        <svg className="-rotate-90" viewBox="0 0 100 100" aria-hidden>
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-[var(--border)]"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={`url(#hydroGrad-${gid})`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
          <defs>
            <linearGradient id={`hydroGrad-${gid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--accent-deep)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-[family-name:var(--font-display)] text-lg tabular-nums text-[var(--foreground)] sm:text-xl md:text-2xl">
            {Math.round(p)}%
          </span>
          <span
            className={`text-[8px] font-medium uppercase tracking-wider sm:text-[10px] ${
              online ? "text-[var(--device-online)]" : "text-[var(--device-offline)]"
            }`}
          >
            {online ? "Conectado" : "Sem sinal"}
          </span>
        </div>
      </div>
      <span className="text-center text-xs font-medium text-[var(--muted)]">{label}</span>
    </div>
  );
}
