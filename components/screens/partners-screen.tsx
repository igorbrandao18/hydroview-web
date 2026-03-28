import {
  Badge,
  Button,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableTd,
  DataTableTh,
  PageHeader,
} from "@/components/ui";
import type { PartnerRow } from "@/lib/mock-pages";
import { getMockPartners } from "@/lib/mock-pages";

function partnerStatusTone(s: PartnerRow["status"]): "success" | "warning" | "critical" {
  if (s === "ativo") return "success";
  if (s === "trial") return "warning";
  return "critical";
}

const statusLabel = { ativo: "Ativo", trial: "Trial", suspenso: "Suspenso" } as const;

export function PartnersScreen() {
  const data = getMockPartners();

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Gestão multitenant"
        title="Empresas parceiras"
        description="Tenants B2B: cada parceiro isola condomínios, usuários e faturamento. Visão típica de super-admin da plataforma."
        actions={
          <>
            <Button variant="secondary" size="sm">
              Exportar
            </Button>
            <Button size="sm">Convidar parceiro</Button>
          </>
        }
      />

      <DataTable>
        <DataTableHead>
          <DataTableRow>
            <DataTableTh>Empresa</DataTableTh>
            <DataTableTh>Slug</DataTableTh>
            <DataTableTh className="text-center">Condomínios</DataTableTh>
            <DataTableTh className="text-center">Dispositivos</DataTableTh>
            <DataTableTh>Status</DataTableTh>
            <DataTableTh className="text-right">Ações</DataTableTh>
          </DataTableRow>
        </DataTableHead>
        <DataTableBody>
          {data.map((p) => (
            <DataTableRow key={p.id}>
              <DataTableTd className="font-medium">{p.name}</DataTableTd>
              <DataTableTd className="font-mono text-xs text-[var(--muted)]">{p.slug}</DataTableTd>
              <DataTableTd className="text-center tabular-nums">{p.condominiums}</DataTableTd>
              <DataTableTd className="text-center tabular-nums">{p.devices}</DataTableTd>
              <DataTableTd>
                <Badge tone={partnerStatusTone(p.status)}>{statusLabel[p.status]}</Badge>
              </DataTableTd>
              <DataTableTd className="text-right">
                <Button variant="ghost" size="sm">
                  Abrir
                </Button>
              </DataTableTd>
            </DataTableRow>
          ))}
        </DataTableBody>
      </DataTable>
    </div>
  );
}
