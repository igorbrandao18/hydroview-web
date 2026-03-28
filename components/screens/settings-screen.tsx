import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, PageHeader, Select } from "@/components/ui";

export function SettingsScreen() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Sistema"
        title="Configurações"
        description="Preferências da organização e padrões de alerta. Alterações sensíveis devem ir para a API com auditoria."
        actions={<Button size="sm">Salvar alterações</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Organização</CardTitle>
            <CardDescription>Dados exibidos no console e em relatórios.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="org-name">Nome fantasia</Label>
              <Input id="org-name" className="mt-1" defaultValue="HidroParceiros Ltda" />
            </div>
            <div>
              <Label htmlFor="tz">Fuso horário</Label>
              <Select id="tz" className="mt-1" defaultValue="America/Sao_Paulo">
                <option value="America/Sao_Paulo">America/São_Paulo</option>
                <option value="America/Fortaleza">America/Fortaleza</option>
                <option value="America/Manaus">America/Manaus</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="locale">Idioma</Label>
              <Select id="locale" className="mt-1" defaultValue="pt-BR">
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unidades e limites</CardTitle>
            <CardDescription>Valores padrão para novos condomínios.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="unit-vol">Volume</Label>
              <Select id="unit-vol" className="mt-1" defaultValue="m3">
                <option value="m3">Metros cúbicos (m³)</option>
                <option value="l">Litros</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="retention">Retenção de logs (dias)</Label>
              <Input id="retention" className="mt-1" type="number" defaultValue={90} min={30} />
            </div>
            <p className="text-xs text-[var(--muted)]">
              Notificações por canal e LGPD: defina políticas com o time jurídico antes de produção.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
