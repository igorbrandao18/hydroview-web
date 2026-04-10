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
    <span className="inline-flex items-center gap-0.5 rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-1.5 py-0.5 text-[0.625rem] text-[var(--muted)] sm:gap-1 sm:px-2 sm:text-xs">
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
    <article className="relative overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm sm:rounded-xl sm:p-4">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--accent)]/10 blur-2xl" />

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <p className="text-[0.625rem] font-semibold uppercase tracking-widest text-[var(--accent-deep)] sm:text-xs">
              {roleLabel[device.role]}
            </p>
            <span
              className={`text-[0.625rem] font-semibold sm:text-xs ${
                device.online
                  ? "text-[var(--device-online)]"
                  : "text-[var(--device-offline)]"
              }`}
            >
              {device.online ? "● conectado" : "○ sem sinal"}
            </span>
          </div>

          <h2 className="mt-0.5 font-[family-name:var(--font-display)] text-base text-[var(--foreground)] sm:mt-1 sm:text-xl">
            {device.name}
          </h2>

          <p className="mt-0.5 font-mono text-[0.625rem] text-[var(--muted)] sm:text-xs">
            {device.id}
          </p>

          {device.productName && (
            <p className="mt-0.5 text-[0.625rem] text-[var(--muted)] sm:text-xs">
              {device.productName}
              {device.category ? ` · cat. ${device.category}` : ""}
            </p>
          )}

          {/* Pills */}
          <div className="mt-2 flex flex-wrap gap-1 sm:mt-3 sm:gap-2">
            <span className={`text-[0.625rem] font-semibold sm:text-xs ${stateClass}`}>
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
            <p className="mt-2 text-xs leading-relaxed text-[var(--muted)] sm:mt-3 sm:text-sm">
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
        <dl className="mt-3 grid grid-cols-2 gap-1.5 border-t border-[var(--border)] pt-3 sm:mt-4 sm:gap-3 sm:pt-4 md:grid-cols-4">
          {device.dataPoints.map((dp) => (
            <div key={dp.code} className="rounded-md bg-[var(--surface-elevated)] px-2 py-1.5 sm:rounded-lg sm:px-3 sm:py-2">
              <dt className="text-[0.5rem] font-medium uppercase tracking-wide text-[var(--muted)] sm:text-[0.625rem]">
                {dp.label}
              </dt>
              <dd className="mt-0.5 text-xs font-semibold tabular-nums text-[var(--foreground)] sm:text-sm">
                {String(dp.value)}
                {dp.unit ? (
                  <span className="ml-0.5 text-[0.625rem] font-normal text-[var(--muted)] sm:text-xs">
                    {dp.unit}
                  </span>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {/* Chart */}
      <LevelChart deviceId={device.id} />

      {/* Footer */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-1 sm:mt-4 sm:gap-2">
        <p className="text-[0.5625rem] text-[var(--muted)] sm:text-[0.625rem]">
          Atualizado · {new Date(device.lastUpdate).toLocaleString("pt-BR")}
        </p>
        {device.updateTime && (
          <p className="text-[0.5625rem] text-[var(--muted)] sm:text-[0.625rem]">
            Tuya sync · {new Date(device.updateTime * 1000).toLocaleString("pt-BR")}
          </p>
        )}
      </div>
    </article>
  );
}
