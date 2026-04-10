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

const rolePt = { caixa: "Caixa d'água", cisterna: "Cisterna", outro: "Outro" } as const;

export function ReservoirsScreen({ devices }: { devices: ReservoirDevice[] }) {
  const avgLevel = devices.length
    ? Math.round(devices.reduce((a, d) => a + d.levelPercent, 0) / devices.length)
    : 0;

  return (
    <div className="">
      <PageHeader
        eyebrow="Operação"
        title="Reservatórios"
        description="Leitura em tempo real de caixas e cisternas vinculadas ao projeto."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total"            value={devices.length} />
        <StatCard label="Conectados agora" value={devices.filter((d) => d.online).length} />
        <StatCard label="Nível médio"      value={`${avgLevel}%`} />
      </div>

      <DataTable>
        <DataTableHead>
          <DataTableRow>
            <DataTableTh>Nome</DataTableTh>
            <DataTableTh>Tipo</DataTableTh>
            <DataTableTh>Nível</DataTableTh>
            <DataTableTh>Estado</DataTableTh>
            <DataTableTh>Status</DataTableTh>
            <DataTableTh className="text-right">Atualização</DataTableTh>
          </DataTableRow>
        </DataTableHead>
        <DataTableBody>
          {devices.map((d) => (
            <DataTableRow key={d.id}>
              <DataTableTd>
                <span className="font-medium">{d.name}</span>
                <div className="font-mono text-[10px] text-[var(--muted)]">{d.id}</div>
              </DataTableTd>
              <DataTableTd>{rolePt[d.role]}</DataTableTd>
              <DataTableTd className="tabular-nums">
                {d.levelPercent}%
                {d.depthMm !== undefined && (
                  <div className="text-[10px] text-[var(--muted)]">{d.depthMm} mm</div>
                )}
              </DataTableTd>
              <DataTableTd>
                {d.liquidState === "normal"
                  ? "Normal"
                  : d.liquidState === "lower_alarm"
                  ? "Nível baixo"
                  : d.liquidState === "upper_alarm"
                  ? "Nível alto"
                  : d.liquidState}
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
