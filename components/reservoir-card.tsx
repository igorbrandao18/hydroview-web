import type { ReservoirDevice } from "@/lib/types";
import { LevelRing } from "./level-ring";
import { LevelChart } from "./level-chart";

type Props = {
  device: ReservoirDevice;
};

const roleLabel: Record<ReservoirDevice["role"], string> = {
  caixa: "Caixa d'água",
  cisterna: "Cisterna",
  outro: "Ponto",
};

const stateColor: Record<string, string> = {
  Normal:       "text-[var(--device-online)]",
  "Nível baixo":"text-[var(--alert-warning-fg)]",
  "Nível alto": "text-[var(--alert-warning-fg)]",
};

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-2 py-0.5 text-xs text-[var(--muted)]">
      <span className="font-medium text-[var(--foreground)]">{value}</span>
      <span>{label}</span>
    </span>
  );
}

export function ReservoirCard({ device }: Props) {
  const stateLabel =
    device.liquidState === "normal"
      ? "Normal"
      : device.liquidState === "lower_alarm"
      ? "Nível baixo"
      : device.liquidState === "upper_alarm"
      ? "Nível alto"
      : device.liquidState;

  const stateClass = stateColor[stateLabel] ?? "text-[var(--muted)]";

  return (
    <article className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--accent)]/10 blur-2xl" />

      {/* Cabeçalho */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-deep)]">
              {roleLabel[device.role]}
            </p>
            <span
              className={`text-xs font-semibold ${
                device.online
                  ? "text-[var(--device-online)]"
                  : "text-[var(--device-offline)]"
              }`}
            >
              {device.online ? "● conectado" : "○ sem sinal"}
            </span>
          </div>

          <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl text-[var(--foreground)]">
            {device.name}
          </h2>

          <p className="mt-0.5 font-mono text-xs text-[var(--muted)]">
            {device.id}
          </p>

          {device.productName && (
            <p className="mt-0.5 text-xs text-[var(--muted)]">
              {device.productName}
              {device.category ? ` · cat. ${device.category}` : ""}
            </p>
          )}

          {/* Pills de estado, sinal e bateria */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className={`text-xs font-semibold ${stateClass}`}>
              {stateLabel}
            </span>
            {device.signalDb !== undefined && (
              <Pill label="dBm" value={String(device.signalDb)} />
            )}
            {device.batteryPercent !== undefined && (
              <Pill label="bat." value={`${device.batteryPercent}%`} />
            )}
            {device.installationHeightMm !== undefined && (
              <Pill label="alt. total" value={`${device.installationHeightMm} mm`} />
            )}
            {device.alarmLowerPct !== undefined && (
              <Pill label="alarme inf." value={`${device.alarmLowerPct}%`} />
            )}
            {device.alarmUpperPct !== undefined && (
              <Pill label="alarme sup." value={`${device.alarmUpperPct}%`} />
            )}
            {device.serialNumber && (
              <Pill label="S/N" value={device.serialNumber} />
            )}
          </div>

          {device.autonomyHint && (
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--muted)]">
              {device.autonomyHint}
            </p>
          )}
        </div>

        <LevelRing
          percent={device.levelPercent}
          label="Ocupação estimada"
          online={device.online}
        />
      </div>

      {/* Data points */}
      {device.dataPoints.length > 0 && (
        <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-[var(--border)] pt-6 sm:grid-cols-4">
          {device.dataPoints.map((dp) => (
            <div key={dp.code} className="rounded-lg bg-[var(--surface-elevated)] px-3 py-2">
              <dt className="text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">
                {dp.label}
              </dt>
              <dd className="mt-0.5 text-sm font-semibold tabular-nums text-[var(--foreground)]">
                {String(dp.value)}
                {dp.unit ? (
                  <span className="ml-0.5 text-xs font-normal text-[var(--muted)]">
                    {dp.unit}
                  </span>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {/* Gráfico de nível 24h */}
      <LevelChart deviceId={device.id} />

      {/* Rodapé */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] text-[var(--muted)]">
          Atualizado · {new Date(device.lastUpdate).toLocaleString("pt-BR")}
        </p>
        {device.updateTime && (
          <p className="text-[10px] text-[var(--muted)]">
            Tuya sync · {new Date(device.updateTime * 1000).toLocaleString("pt-BR")}
          </p>
        )}
      </div>
    </article>
  );
}
