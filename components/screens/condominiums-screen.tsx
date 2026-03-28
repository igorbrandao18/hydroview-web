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
import { type CondominiumRow, getMockCondominiums } from "@/lib/mock-pages";

function condoStatusTone(s: CondominiumRow["status"]): "success" | "neutral" {
  return s === "ativo" ? "success" : "neutral";
}

const statusLabel = { ativo: "Ativo", inativo: "Inativo" } as const;

export function CondominiumsScreen() {
  const data = getMockCondominiums();

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Gestão multitenant"
        title="Condomínios"
        description="Cadastro vinculado ao parceiro. Torre, síndico e políticas de alerta ficam no detalhe de cada unidade."
        actions={
          <>
            <Button variant="secondary" size="sm">
              Importar CSV
            </Button>
            <Button size="sm">Novo condomínio</Button>
          </>
        }
      />

      <DataTable>
        <DataTableHead>
          <DataTableRow>
            <DataTableTh>Nome</DataTableTh>
            <DataTableTh>Local</DataTableTh>
            <DataTableTh>Parceiro</DataTableTh>
            <DataTableTh className="text-center">Reservatórios</DataTableTh>
            <DataTableTh>Status</DataTableTh>
            <DataTableTh className="text-right">Ações</DataTableTh>
          </DataTableRow>
        </DataTableHead>
        <DataTableBody>
          {data.map((c) => (
            <DataTableRow key={c.id}>
              <DataTableTd className="font-medium">{c.name}</DataTableTd>
              <DataTableTd>{c.city}</DataTableTd>
              <DataTableTd>{c.partner}</DataTableTd>
              <DataTableTd className="text-center tabular-nums">{c.reservoirs}</DataTableTd>
              <DataTableTd>
                <Badge tone={condoStatusTone(c.status)}>{statusLabel[c.status]}</Badge>
              </DataTableTd>
              <DataTableTd className="text-right">
                <Button variant="ghost" size="sm">
                  Editar
                </Button>
              </DataTableTd>
            </DataTableRow>
          ))}
        </DataTableBody>
      </DataTable>
    </div>
  );
}
