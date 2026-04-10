import {
  Badge,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableTd,
  DataTableTh,
  PageHeader,
  StatCard,
} from "@/components/ui";
import type { ReservoirDevice } from "@/lib/types";

export function DevicesScreen({ devices }: { devices: ReservoirDevice[] }) {
  return (
    <div className="">
      <PageHeader
        eyebrow="Operação"
        title="Dispositivos"
        description="Catálogo de sensores sincronizado com a plataforma IoT."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Dispositivos" value={devices.length} />
        <StatCard label="Conectados"   value={devices.filter((d) => d.online).length} />
        <StatCard label="Sem sinal"    value={devices.filter((d) => !d.online).length} />
      </div>

      <DataTable>
        <DataTableHead>
          <DataTableRow>
            <DataTableTh>Dispositivo</DataTableTh>
            <DataTableTh>Produto</DataTableTh>
            <DataTableTh>Nível</DataTableTh>
            <DataTableTh>Status</DataTableTh>
            <DataTableTh className="text-right">Atualização</DataTableTh>
          </DataTableRow>
        </DataTableHead>
        <DataTableBody>
          {devices.map((d) => (
            <DataTableRow key={d.id}>
              <DataTableTd>
                <span className="font-medium">{d.name}</span>
                <div className="font-mono text-[0.625rem] text-[var(--muted)]">{d.id}</div>
                {d.serialNumber && (
                  <div className="font-mono text-[0.625rem] text-[var(--muted)]">S/N {d.serialNumber}</div>
                )}
              </DataTableTd>
              <DataTableTd>
                <span>{d.productName ?? "—"}</span>
                {d.spaceName && (
                  <div className="text-[0.625rem] text-[var(--muted)]">{d.spaceName}</div>
                )}
              </DataTableTd>
              <DataTableTd className="tabular-nums">
                {d.levelPercent}%
                {d.alarmLowerPct !== undefined && (
                  <div className="text-[0.625rem] text-[var(--muted)]">
                    limiar {d.alarmLowerPct}–{d.alarmUpperPct ?? 100}%
                  </div>
                )}
              </DataTableTd>
              <DataTableTd>
                <Badge tone={d.online ? "success" : "critical"}>
                  {d.online ? "Conectado" : "Sem sinal"}
                </Badge>
              </DataTableTd>
              <DataTableTd className="text-right text-[var(--muted)]">
                {new Date(d.lastUpdate).toLocaleString("pt-BR")}
              </DataTableTd>
            </DataTableRow>
          ))}
        </DataTableBody>
      </DataTable>
    </div>
  );
}
