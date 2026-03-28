import { AlertList } from "@/components/alert-list";
import { Button, Input, PageHeader, StatCard } from "@/components/ui";
import type { DashboardAlert } from "@/lib/types";

export function AlertsScreen({ alerts }: { alerts: DashboardAlert[] }) {
  const critical = alerts.filter((a) => a.level === "critical").length;
  const warning  = alerts.filter((a) => a.level === "warning").length;
  const ok       = alerts.filter((a) => a.level === "ok").length;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Operação"
        title="Alertas"
        description="Eventos de nível e conexão gerados em tempo real a partir dos sensores."
        actions={
          <>
            <Button variant="secondary" size="sm">Marcar todos lidos</Button>
            <Button size="sm">Nova regra</Button>
          </>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Críticos abertos" value={critical} />
        <StatCard label="Atenção"           value={warning} />
        <StatCard label="Informativos"      value={ok} />
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="max-w-xs flex-1">
          <label htmlFor="alerts-from" className="mb-1 block text-xs font-medium text-[var(--muted)]">
            De
          </label>
          <Input id="alerts-from" type="date" />
        </div>
        <div className="max-w-xs flex-1">
          <label htmlFor="alerts-to" className="mb-1 block text-xs font-medium text-[var(--muted)]">
            Até
          </label>
          <Input id="alerts-to" type="date" />
        </div>
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
