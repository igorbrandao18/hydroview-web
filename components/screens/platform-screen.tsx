import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  PageHeader,
  Select,
} from "@/components/ui";

export function PlatformScreen() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Integrações"
        title="Plataforma IoT"
        description="Credenciais e parâmetros usados pelo backend para sincronizar dispositivos. Valores abaixo são fictícios."
        actions={<Button size="sm">Testar conexão</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ambiente</CardTitle>
            <CardDescription>Região e escopo do projeto na nuvem.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="region">Região</Label>
              <Select id="region" className="mt-1" defaultValue="br">
                <option value="br">América — São Paulo</option>
                <option value="us">América — Virgínia</option>
                <option value="eu">Europa — Frankfurt</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="project">ID do projeto</Label>
              <Input id="project" className="mt-1" defaultValue="prj_demo_hydro_01" readOnly />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chaves de API</CardTitle>
            <CardDescription>Armazenadas apenas no servidor (env). Nunca no bundle do cliente.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="key-id">Client ID</Label>
              <Input id="key-id" className="mt-1 font-mono text-xs" type="password" defaultValue="••••••••••••" readOnly />
            </div>
            <div>
              <Label htmlFor="key-secret">Client secret</Label>
              <Input id="key-secret" className="mt-1 font-mono text-xs" type="password" defaultValue="••••••••••••••••" readOnly />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="secondary" size="sm">
              Rotacionar chaves
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
