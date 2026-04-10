import { AlertList } from "@/components/alert-list";
import { ReservoirCard } from "@/components/reservoir-card";
import { PageHeader, StatCard } from "@/components/ui";
import type { DashboardAlert, ReservoirDevice } from "@/lib/types";

type Props = {
  reservoirs: ReservoirDevice[];
  alerts: DashboardAlert[];
};

export function DashboardScreen({ reservoirs, alerts }: Props) {
  const online  = reservoirs.filter((d) => d.online).length;
  const offline = reservoirs.filter((d) => !d.online).length;
  const avgLevel = reservoirs.length
    ? Math.round(reservoirs.reduce((a, d) => a + d.levelPercent, 0) / reservoirs.length)
    : 0;

  return (
    <div>
      <PageHeader
        eyebrow="Painel do condomínio"
        title="Água em tempo quase real"
        description="Visão operacional para síndicos e empresas parceiras: níveis, alertas e telemetria dos sensores."
      />

      {/* Resumo rápido */}
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Conectados" value={online} />
        <StatCard label="Sem sinal" value={offline} />
        <StatCard label="Nível médio" value={`${avgLevel}%`} />
      </div>

      {/* Alertas */}
      {alerts.length > 0 && (
        <section className="mb-4">
          <h2 className="mb-4 font-[family-name:var(--font-display)] text-lg text-[var(--foreground)]">
            Alertas
          </h2>
          <AlertList alerts={alerts} />
        </section>
      )}

      {/* Reservatórios */}
      <section className="mb-4">
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-lg text-[var(--foreground)]">
          Reservatórios
        </h2>
        {reservoirs.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">Nenhum dispositivo encontrado no projeto.</p>
        ) : (
          <div className="grid gap-3">
            {reservoirs.map((d) => (
              <ReservoirCard key={d.id} device={d} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
