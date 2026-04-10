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
import type { TeamMemberRow } from "@/lib/mock-pages";
import { getMockTeam } from "@/lib/mock-pages";

function memberTone(s: TeamMemberRow["status"]): "success" | "warning" {
  return s === "ativo" ? "success" : "warning";
}

const statusLabel = { ativo: "Ativo", convite: "Convite pendente" } as const;

export function TeamScreen() {
  const data = getMockTeam();

  return (
    <div className="">
      <PageHeader
        eyebrow="Sistema"
        title="Usuários & permissões"
        description="Papéis por tenant. Convites e 2FA serão validados no backend."
        actions={
          <>
            <Button variant="secondary" size="sm">
              Exportar lista
            </Button>
            <Button size="sm">Convidar usuário</Button>
          </>
        }
      />

      <DataTable>
        <DataTableHead>
          <DataTableRow>
            <DataTableTh>Nome</DataTableTh>
            <DataTableTh>E-mail</DataTableTh>
            <DataTableTh>Papel</DataTableTh>
            <DataTableTh>Status</DataTableTh>
            <DataTableTh className="text-right">Último acesso</DataTableTh>
          </DataTableRow>
        </DataTableHead>
        <DataTableBody>
          {data.map((u) => (
            <DataTableRow key={u.id}>
              <DataTableTd className="font-medium">{u.name}</DataTableTd>
              <DataTableTd className="text-[var(--muted)]">{u.email}</DataTableTd>
              <DataTableTd>{u.role}</DataTableTd>
              <DataTableTd>
                <Badge tone={memberTone(u.status)}>{statusLabel[u.status]}</Badge>
              </DataTableTd>
              <DataTableTd className="text-right text-[var(--muted)]">
                {u.lastAccess === "—" ? "—" : new Date(u.lastAccess).toLocaleString("pt-BR")}
              </DataTableTd>
            </DataTableRow>
          ))}
        </DataTableBody>
      </DataTable>
    </div>
  );
}
