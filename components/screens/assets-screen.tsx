import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, PageHeader } from "@/components/ui";
import { AssetTree } from "@/components/features/asset-tree";
import { getMockAssetTree } from "@/lib/mock-pages";

export function AssetsScreen() {
  const root = getMockAssetTree();

  return (
    <div className="">
      <PageHeader
        eyebrow="Gestão multitenant"
        title="Assets & hierarquia"
        description="Árvore física do empreendimento até o dispositivo. Use para navegação e vínculos no backend."
        actions={
          <>
            <Button variant="secondary" size="sm">
              Recolher tudo
            </Button>
            <Button size="sm">Novo nó</Button>
          </>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Estrutura</CardTitle>
          <CardDescription>Parceiro → condomínio → torre → reservatório → dispositivo.</CardDescription>
        </CardHeader>
        <CardContent>
          <AssetTree root={root} />
        </CardContent>
      </Card>
    </div>
  );
}
