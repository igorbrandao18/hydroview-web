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
import { getMockBillingSummary } from "@/lib/mock-pages";

const invoices = [
  { id: "inv-0326", date: "2026-03-01", amount: "R$ 489,00", status: "Pago" as const },
  { id: "inv-0226", date: "2026-02-01", amount: "R$ 489,00", status: "Pago" as const },
  { id: "inv-0126", date: "2026-01-01", amount: "R$ 449,00", status: "Pago" as const },
];

export function BillingScreen() {
  const summary = getMockBillingSummary();

  return (
    <div className="">
      <PageHeader
        eyebrow="Sistema"
        title="Faturamento"
        description="Plano, uso medido e histórico de cobrança. Gateway de pagamento a definir."
        actions={<Button variant="secondary" size="sm">Portal do cliente</Button>}
      />

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Plano atual</CardTitle>
            <CardDescription>{summary.meters}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm text-[var(--muted)]">Próxima cobrança</p>
              <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)]">
                {summary.amount}
              </p>
              <p className="text-sm text-[var(--muted)]">
                em {new Date(summary.nextCharge).toLocaleDateString("pt-BR")} — {summary.plan}
              </p>
            </div>
            <Badge tone="success">Conta {summary.status}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="secondary" className="w-full" size="sm">
              Alterar plano
            </Button>
            <Button variant="ghost" className="w-full" size="sm">
              Método de pagamento
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Faturas recentes</CardTitle>
        </CardHeader>
        <CardContent className="!px-0 !pb-0">
          <DataTable className="rounded-none border-0">
            <DataTableHead>
              <DataTableRow>
                <DataTableTh>ID</DataTableTh>
                <DataTableTh>Data</DataTableTh>
                <DataTableTh>Valor</DataTableTh>
                <DataTableTh>Status</DataTableTh>
                <DataTableTh className="text-right">Recibo</DataTableTh>
              </DataTableRow>
            </DataTableHead>
            <DataTableBody>
              {invoices.map((inv) => (
                <DataTableRow key={inv.id}>
                  <DataTableTd className="font-mono text-xs">{inv.id}</DataTableTd>
                  <DataTableTd>{new Date(inv.date).toLocaleDateString("pt-BR")}</DataTableTd>
                  <DataTableTd className="tabular-nums">{inv.amount}</DataTableTd>
                  <DataTableTd>
                    <Badge tone="success">{inv.status}</Badge>
                  </DataTableTd>
                  <DataTableTd className="text-right">
                    <Button variant="ghost" size="sm">
                      PDF
                    </Button>
                  </DataTableTd>
                </DataTableRow>
              ))}
            </DataTableBody>
          </DataTable>
        </CardContent>
      </Card>
    </div>
  );
}
