import {
  Button,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableTd,
  DataTableTh,
  Input,
  PageHeader,
} from "@/components/ui";
import { getMockAudit } from "@/lib/mock-pages";

export function AuditScreen() {
  const rows = getMockAudit();

  return (
    <div className="">
      <PageHeader
        eyebrow="Sistema"
        title="Auditoria"
        description="Trilha de alterações e ações administrativas. Exportação para compliance via API."
        actions={
          <Button variant="secondary" size="sm">
            Exportar CSV
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="max-w-xs flex-1">
          <label htmlFor="audit-q" className="mb-1 block text-xs font-medium text-[var(--muted)]">
            Buscar
          </label>
          <Input id="audit-q" type="search" placeholder="Ação, recurso, e-mail…" />
        </div>
        <div className="max-w-[8.75rem]">
          <label htmlFor="audit-from" className="mb-1 block text-xs font-medium text-[var(--muted)]">
            De
          </label>
          <Input id="audit-from" type="date" />
        </div>
      </div>

      <DataTable>
        <DataTableHead>
          <DataTableRow>
            <DataTableTh>Quando</DataTableTh>
            <DataTableTh>Quem</DataTableTh>
            <DataTableTh>Ação</DataTableTh>
            <DataTableTh>Recurso</DataTableTh>
          </DataTableRow>
        </DataTableHead>
        <DataTableBody>
          {rows.map((r) => (
            <DataTableRow key={r.id}>
              <DataTableTd className="whitespace-nowrap text-[var(--muted)]">
                {new Date(r.at).toLocaleString("pt-BR")}
              </DataTableTd>
              <DataTableTd className="text-sm">{r.actor}</DataTableTd>
              <DataTableTd>{r.action}</DataTableTd>
              <DataTableTd className="text-[var(--muted)]">{r.resource}</DataTableTd>
            </DataTableRow>
          ))}
        </DataTableBody>
      </DataTable>
    </div>
  );
}
