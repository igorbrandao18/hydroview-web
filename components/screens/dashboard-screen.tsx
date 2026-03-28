import { ReservoirCard } from "@/components/reservoir-card";
import { PageHeader } from "@/components/ui";
import type { ReservoirDevice } from "@/lib/types";

export function DashboardScreen({ reservoirs }: { reservoirs: ReservoirDevice[] }) {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Painel do condomínio"
        title="Água em tempo quase real"
        description="Visão operacional para síndicos e empresas parceiras: níveis e telemetria dos sensores."
      />

      <section className="mb-12">
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-lg text-[var(--foreground)]">
          Reservatórios
        </h2>
        {reservoirs.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">Nenhum dispositivo encontrado no projeto.</p>
        ) : (
          <div className="grid gap-6">
            {reservoirs.map((d) => (
              <ReservoirCard key={d.id} device={d} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
