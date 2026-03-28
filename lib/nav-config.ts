export type NavItem = {
  href: string;
  label: string;
  badge?: string;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export const saasNav: NavSection[] = [
  {
    title: "Visão geral",
    items: [{ href: "/dashboard", label: "Início" }],
  },
  {
    title: "Operação",
    items: [
      { href: "/reservoirs", label: "Reservatórios" },
      { href: "/devices", label: "Dispositivos" },
      { href: "/alerts", label: "Alertas" },
      { href: "/reports", label: "Relatórios" },
    ],
  },
  {
    title: "Gestão multitenant",
    items: [
      { href: "/partners", label: "Empresas parceiras" },
      { href: "/condominiums", label: "Condomínios" },
      { href: "/assets", label: "Assets & hierarquia" },
    ],
  },
  {
    title: "Integrações",
    items: [
      { href: "/integrations/platform", label: "Plataforma IoT" },
      { href: "/integrations/webhooks", label: "Webhooks & API" },
    ],
  },
  {
    title: "Sistema",
    items: [
      { href: "/team", label: "Usuários & permissões" },
      { href: "/billing", label: "Faturamento" },
      { href: "/settings", label: "Configurações" },
      { href: "/audit", label: "Auditoria" },
    ],
  },
];
