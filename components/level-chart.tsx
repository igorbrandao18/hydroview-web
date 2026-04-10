"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import type { DeviceHistory, LevelHistoryPoint } from "@/lib/types";

type Props = {
  deviceId: string;
};

const REF_LINES: {
  key: keyof Pick<DeviceHistory, "alarmUpperPct" | "alarmLowerPct">;
  label: string;
  color: string;
  dash?: string;
}[] = [
  { key: "alarmUpperPct", label: "Alarme superior", color: "#f97316", dash: "6 3" },
  { key: "alarmLowerPct", label: "Alarme inferior", color: "#22c55e", dash: "6 3" },
];

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { payload: LevelHistoryPoint }[] }) {
  if (!active || !payload?.[0]) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 text-xs shadow-md">
      <p className="font-semibold text-[var(--foreground)]">{p.time}</p>
      <p className="text-[var(--muted)]">Nível: <span className="font-semibold text-[var(--accent)]">{p.levelPercent}%</span></p>
      {p.depthMm > 0 && (
        <p className="text-[var(--muted)]">Profundidade: {p.depthMm} mm</p>
      )}
    </div>
  );
}

export function LevelChart({ deviceId }: Props) {
  const [history, setHistory] = useState<DeviceHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`/api/history?device_id=${encodeURIComponent(deviceId)}`)
      .then((r) => {
        if (!r.ok) throw new Error("Falha ao carregar histórico");
        return r.json();
      })
      .then((data: DeviceHistory) => setHistory(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [deviceId]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">
        Carregando histórico…
      </div>
    );
  }

  if (error || !history) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">
        {error || "Histórico indisponível"}
      </div>
    );
  }

  if (history.points.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">
        Sem dados de histórico nas últimas 24h.
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">
          Nível nas últimas 24h — {history.deviceName}
        </h3>
        <span className="text-[10px] text-[var(--muted)]">
          {history.points.length} leituras
        </span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={history.points} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${deviceId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: "var(--muted)" }}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "var(--muted)" }}
            tickFormatter={(v: number) => `${v}%`}
          />
          <Tooltip content={<ChartTooltip />} />

          {/* Linha de 100% — teto */}
          <ReferenceLine
            y={100}
            stroke="#3b82f6"
            strokeWidth={2}
            label={{ value: "Teto (100%)", position: "insideTopRight", fontSize: 9, fill: "#3b82f6" }}
          />

          {/* Linhas de alarme configuradas no sensor */}
          {REF_LINES.map((ref) => {
            const val = history[ref.key];
            if (val === undefined) return null;
            return (
              <ReferenceLine
                key={ref.key}
                y={val}
                stroke={ref.color}
                strokeDasharray={ref.dash}
                strokeWidth={1.5}
                label={{
                  value: `${ref.label} (${val}%)`,
                  position: "insideBottomRight",
                  fontSize: 9,
                  fill: ref.color,
                }}
              />
            );
          })}

          {/* Linha de nível crítico fixo em 10% */}
          <ReferenceLine
            y={10}
            stroke="#ef4444"
            strokeWidth={2}
            label={{ value: "Crítico (10%)", position: "insideBottomRight", fontSize: 9, fill: "#ef4444" }}
          />

          <Area
            type="monotone"
            dataKey="levelPercent"
            stroke="var(--accent)"
            strokeWidth={2}
            fill={`url(#grad-${deviceId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Legenda */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-[var(--muted)]">
        <span className="flex items-center gap-1">
          <span className="inline-block h-0.5 w-4 bg-[#3b82f6]" /> Teto (100%)
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-0.5 w-4 bg-[#f97316]" style={{ borderTop: "1.5px dashed #f97316", background: "none" }} /> Alarme superior ({history.alarmUpperPct}%)
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-0.5 w-4 bg-[#22c55e]" style={{ borderTop: "1.5px dashed #22c55e", background: "none" }} /> Alarme inferior ({history.alarmLowerPct}%)
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-0.5 w-4 bg-[#ef4444]" /> Crítico (10%)
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-0.5 w-4 bg-[var(--accent)]" /> Nível medido
        </span>
      </div>
    </div>
  );
}
