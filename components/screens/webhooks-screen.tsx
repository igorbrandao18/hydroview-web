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
  Input,
  Label,
  PageHeader,
  Textarea,
} from "@/components/ui";
import { getMockWebhooks } from "@/lib/mock-pages";

export function WebhooksScreen() {
  const rows = getMockWebhooks();

  return (
    <div className="">
      <PageHeader
        eyebrow="Integrações"
        title="Webhooks & API"
        description="Endpoints que o HydroView chama ou que você expõe para eventos. Assinatura e retries no servidor."
        actions={<Button size="sm">Nova URL</Button>}
      />

      <div className="mb-8 grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Registrar endpoint</CardTitle>
            <CardDescription>Formulário de demonstração — persistência via API.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="wh-url">URL HTTPS</Label>
              <Input id="wh-url" className="mt-1" placeholder="https://…" />
            </div>
            <div>
              <Label htmlFor="wh-events">Eventos (lista)</Label>
              <Textarea id="wh-events" className="mt-1" rows={3} placeholder="alert.created, device.status" />
            </div>
            <Button className="w-full" variant="secondary">
              Salvar rascunho
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <DataTable>
            <DataTableHead>
              <DataTableRow>
                <DataTableTh>URL</DataTableTh>
                <DataTableTh>Eventos</DataTableTh>
                <DataTableTh>Status</DataTableTh>
                <DataTableTh className="text-right">Última entrega</DataTableTh>
              </DataTableRow>
            </DataTableHead>
            <DataTableBody>
              {rows.map((w) => (
                <DataTableRow key={w.id}>
                  <DataTableTd className="max-w-[200px] truncate font-mono text-xs">{w.url}</DataTableTd>
                  <DataTableTd className="text-xs text-[var(--muted)]">{w.events}</DataTableTd>
                  <DataTableTd>
                    <Badge tone={w.status === "ativo" ? "success" : "neutral"}>
                      {w.status === "ativo" ? "Ativo" : "Pausado"}
                    </Badge>
                  </DataTableTd>
                  <DataTableTd className="text-right text-[var(--muted)]">
                    {w.lastDelivery === "—" ? "—" : new Date(w.lastDelivery).toLocaleString("pt-BR")}
                  </DataTableTd>
                </DataTableRow>
              ))}
            </DataTableBody>
          </DataTable>
        </div>
      </div>
    </div>
  );
}
