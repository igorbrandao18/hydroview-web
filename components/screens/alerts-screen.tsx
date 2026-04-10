import { AlertList } from "@/components/alert-list";
import { PageHeader, StatCard } from "@/components/ui";
import type { DashboardAlert } from "@/lib/types";

export function AlertsScreen({ alerts }: { alerts: DashboardAlert[] }) {
  const critical = alerts.filter((a) => a.level === "critical").length;
  const warning  = alerts.filter((a) => a.level === "warning").length;
  const ok       = alerts.filter((a) => a.level === "ok").length;

  return (
    <div className="">
      <PageHeader
        eyebrow="Operação"
        title="Alertas"
        description="Eventos de nível e conexão gerados em tempo real a partir dos sensores."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Críticos" value={critical} />
        <StatCard label="Atenção"  value={warning} />
        <StatCard label="Tudo certo" value={ok} />
      </div>

      <section>
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-lg text-[var(--foreground)]">
          Linha do tempo
        </h2>
        <AlertList alerts={alerts} />
      </section>
    </div>
  );
}
