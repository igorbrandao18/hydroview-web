export type NavItem = {
  href: string;
  label: string;
  badge?: string;
  disabled?: boolean;
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
      { href: "/reports", label: "Relatórios", disabled: true, badge: "Em breve" },
    ],
  },
  {
    title: "Gestão",
    items: [
      { href: "/condominiums", label: "Condomínios", disabled: true, badge: "Em breve" },
      { href: "/partners", label: "Empresas parceiras", disabled: true, badge: "Em breve" },
      { href: "/assets", label: "Assets & hierarquia", disabled: true, badge: "Em breve" },
    ],
  },
  {
    title: "Sistema",
    items: [
      { href: "/settings", label: "Configurações", disabled: true, badge: "Em breve" },
      { href: "/team", label: "Usuários", disabled: true, badge: "Em breve" },
      { href: "/billing", label: "Faturamento", disabled: true, badge: "Em breve" },
      { href: "/audit", label: "Auditoria", disabled: true, badge: "Em breve" },
      { href: "/integrations/platform", label: "Plataforma IoT", disabled: true, badge: "Em breve" },
      { href: "/integrations/webhooks", label: "Webhooks", disabled: true, badge: "Em breve" },
    ],
  },
];
