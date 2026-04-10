import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableTd,
  DataTableTh,
  PageHeader,
} from "@/components/ui";
import { getMockReports } from "@/lib/mock-pages";

export function ReportsScreen() {
  const rows = getMockReports();

  return (
    <div className="">
      <PageHeader
        eyebrow="Operação"
        title="Relatórios"
        description="Modelos agendados e exportações manuais. Integração com armazenamento e e-mail fica no servidor."
        actions={
          <Button size="sm">Novo modelo</Button>
        }
      />

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Modelos</CardTitle>
            <CardDescription>Últimas execuções e formatos de saída.</CardDescription>
          </CardHeader>
          <CardContent className="!px-0 !pb-0">
            <DataTable className="rounded-none border-0">
              <DataTableHead>
                <DataTableRow>
                  <DataTableTh>Nome</DataTableTh>
                  <DataTableTh>Agenda</DataTableTh>
                  <DataTableTh>Formato</DataTableTh>
                  <DataTableTh className="text-right">Última execução</DataTableTh>
                </DataTableRow>
              </DataTableHead>
              <DataTableBody>
                {rows.map((r) => (
                  <DataTableRow key={r.id}>
                    <DataTableTd className="font-medium">{r.name}</DataTableTd>
                    <DataTableTd>{r.schedule}</DataTableTd>
                    <DataTableTd>
                      <Badge tone="neutral">{r.format}</Badge>
                    </DataTableTd>
                    <DataTableTd className="text-right text-[var(--muted)]">
                      {new Date(r.lastRun).toLocaleString("pt-BR")}
                    </DataTableTd>
                  </DataTableRow>
                ))}
              </DataTableBody>
            </DataTable>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exportação rápida</CardTitle>
            <CardDescription>Gerar arquivo único com o período atual.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="secondary" className="w-full">
              PDF — resumo do mês
            </Button>
            <Button variant="secondary" className="w-full">
              CSV — leituras brutas
            </Button>
            <Button variant="ghost" className="w-full" size="sm">
              Ver histórico de downloads
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
