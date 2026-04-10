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

/** Linhas de referência — cores inspiradas no Aquanet */
const REF_LINES = [
  { key: "limiteSuperior", label: "Limite superior",   color: "#2563eb", dash: undefined,  width: 2   },
  { key: "extravasador",   label: "Extravasador",      color: "#e879f9", dash: "6 3",      width: 1.5 },
  { key: "recargaMaxima",  label: "Recarga máxima",    color: "#f97316", dash: "6 3",      width: 1.5 },
  { key: "recargaMinima",  label: "Recarga mínima",    color: "#22c55e", dash: "6 3",      width: 1.5 },
  { key: "nivelCritico",   label: "Nível crítico",     color: "#a855f7", dash: "4 2",      width: 1.5 },
  { key: "reservaTecnica", label: "Reserva técnica",   color: "#ef4444", dash: undefined,  width: 2   },
] as const;

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { payload: LevelHistoryPoint }[] }) {
  if (!active || !payload?.[0]) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 text-xs shadow-md">
      <p className="font-semibold text-[var(--foreground)]">{p.time}</p>
      <p className="text-[var(--muted)]">
        Nível: <span className="font-semibold text-[var(--accent)]">{p.levelM.toFixed(2)} m</span>
        <span className="ml-2 text-[var(--muted)]">({p.levelPercent}%)</span>
      </p>
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
      <div className="flex h-48 items-center justify-center text-sm text-[var(--muted)]">
        Carregando histórico…
      </div>
    );
  }

  if (error || !history) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-[var(--muted)]">
        {error || "Histórico indisponível"}
      </div>
    );
  }

  if (history.points.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-[var(--muted)]">
        Sem dados de histórico nas últimas 24h.
      </div>
    );
  }

  const t = history.thresholds ?? {
    limiteSuperior: 2.80,
    extravasador: 2.30,
    recargaMaxima: 2.10,
    recargaMinima: 1.80,
    nivelCritico: 0.60,
    reservaTecnica: 0.95,
  };
  const yMax = Math.ceil((t.limiteSuperior + 0.2) * 10) / 10;

  return (
    <div className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">
          Nível nas últimas 24h — {history.deviceName}
        </h3>
        <span className="text-[10px] text-[var(--muted)]">
          {history.points.length} leituras
        </span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={history.points} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${deviceId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: "var(--muted)" }}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, yMax]}
            tick={{ fontSize: 10, fill: "var(--muted)" }}
            tickFormatter={(v: number) => `${v.toFixed(1)}m`}
          />
          <Tooltip content={<ChartTooltip />} />

          {/* Linhas de referência operacionais */}
          {REF_LINES.map((ref) => {
            const val = t[ref.key as keyof typeof t];
            if (val === undefined) return null;
            return (
              <ReferenceLine
                key={ref.key}
                y={val}
                stroke={ref.color}
                strokeDasharray={ref.dash}
                strokeWidth={ref.width}
                label={{
                  value: `${ref.label} (${val.toFixed(2)}m)`,
                  position: "insideTopRight",
                  fontSize: 9,
                  fill: ref.color,
                }}
              />
            );
          })}

          <Area
            type="monotone"
            dataKey="levelM"
            stroke="#38bdf8"
            strokeWidth={2}
            fill={`url(#grad-${deviceId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Legenda */}
      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-[var(--muted)] sm:grid-cols-4">
        {REF_LINES.map((ref) => (
          <span key={ref.key} className="flex items-center gap-1">
            <span
              className="inline-block h-0.5 w-4"
              style={{
                background: ref.dash ? "none" : ref.color,
                borderTop: ref.dash ? `1.5px dashed ${ref.color}` : "none",
              }}
            />
            {ref.label} ({t[ref.key as keyof typeof t]?.toFixed(2)}m)
          </span>
        ))}
        <span className="flex items-center gap-1">
          <span className="inline-block h-0.5 w-4 bg-[#38bdf8]" />
          Nível medido
        </span>
      </div>
    </div>
  );
}
