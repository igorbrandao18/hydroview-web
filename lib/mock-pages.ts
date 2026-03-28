/** Dados de listagem e formulários para telas SaaS — substituir por services + API. */

export type ReservoirListRow = {
  id: string;
  name: string;
  role: "caixa" | "cisterna" | "outro";
  condominium: string;
  levelPercent: number;
  online: boolean;
  lastUpdate: string;
};

export type DeviceRow = {
  id: string;
  name: string;
  condominium: string;
  product: string;
  online: boolean;
  lastSeen: string;
};

export type PartnerRow = {
  id: string;
  name: string;
  slug: string;
  condominiums: number;
  devices: number;
  status: "ativo" | "trial" | "suspenso";
};

export type CondominiumRow = {
  id: string;
  name: string;
  city: string;
  partner: string;
  reservoirs: number;
  status: "ativo" | "inativo";
};

export type AssetTreeNode = {
  id: string;
  label: string;
  type: "parceiro" | "condomínio" | "torre" | "reservatório" | "dispositivo";
  children?: AssetTreeNode[];
};

export type TeamMemberRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  lastAccess: string;
  status: "ativo" | "convite";
};

export type AuditRow = {
  id: string;
  at: string;
  actor: string;
  action: string;
  resource: string;
};

export type WebhookRow = {
  id: string;
  url: string;
  events: string;
  status: "ativo" | "pausado";
  lastDelivery: string;
};

export type ReportTemplateRow = {
  id: string;
  name: string;
  schedule: string;
  format: string;
  lastRun: string;
};

export function getMockReservoirRows(): ReservoirListRow[] {
  return [
    {
      id: "eb689eaa949930eddeix1y",
      name: "Caixa d'água — bloco A",
      role: "caixa",
      condominium: "Residencial Águas Claras",
      levelPercent: 33,
      online: true,
      lastUpdate: new Date().toISOString(),
    },
    {
      id: "vdevo177204595020032",
      name: "Cisterna coletora",
      role: "cisterna",
      condominium: "Residencial Águas Claras",
      levelPercent: 72,
      online: true,
      lastUpdate: new Date().toISOString(),
    },
    {
      id: "dev-sim-003",
      name: "Caixa técnica — bloco B",
      role: "caixa",
      condominium: "Residencial Águas Claras",
      levelPercent: 48,
      online: false,
      lastUpdate: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
  ];
}

export function getMockDeviceRows(): DeviceRow[] {
  return [
    {
      id: "eb689eaa949930eddeix1y",
      name: "Sensor nível A",
      condominium: "Águas Claras",
      product: "Nível ultrassom",
      online: true,
      lastSeen: new Date().toISOString(),
    },
    {
      id: "vdevo177204595020032",
      name: "Sensor nível cisterna",
      condominium: "Águas Claras",
      product: "Nível ultrassom",
      online: true,
      lastSeen: new Date().toISOString(),
    },
    {
      id: "gw-001",
      name: "Gateway área comum",
      condominium: "Águas Claras",
      product: "Gateway multi",
      online: false,
      lastSeen: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
}

export function getMockPartners(): PartnerRow[] {
  return [
    {
      id: "p1",
      name: "HidroParceiros Ltda",
      slug: "hidro-parceiros",
      condominiums: 12,
      devices: 48,
      status: "ativo",
    },
    {
      id: "p2",
      name: "Águas do Vale",
      slug: "aguas-do-vale",
      condominiums: 4,
      devices: 14,
      status: "trial",
    },
    {
      id: "p3",
      name: "MonitorH2O",
      slug: "monitor-h2o",
      condominiums: 1,
      devices: 3,
      status: "suspenso",
    },
  ];
}

export function getMockCondominiums(): CondominiumRow[] {
  return [
    {
      id: "c1",
      name: "Residencial Águas Claras",
      city: "São Paulo — SP",
      partner: "HidroParceiros Ltda",
      reservoirs: 3,
      status: "ativo",
    },
    {
      id: "c2",
      name: "Edifício Nascente",
      city: "Campinas — SP",
      partner: "HidroParceiros Ltda",
      reservoirs: 2,
      status: "ativo",
    },
    {
      id: "c3",
      name: "Condomínio Horizonte",
      city: "Sorocaba — SP",
      partner: "Águas do Vale",
      reservoirs: 1,
      status: "inativo",
    },
  ];
}

export function getMockAssetTree(): AssetTreeNode {
  return {
    id: "root",
    label: "HidroParceiros Ltda",
    type: "parceiro",
    children: [
      {
        id: "c1",
        label: "Residencial Águas Claras",
        type: "condomínio",
        children: [
          {
            id: "t-a",
            label: "Torre A",
            type: "torre",
            children: [
              {
                id: "r-a1",
                label: "Caixa d'água — bloco A",
                type: "reservatório",
                children: [{ id: "eb689eaa949930eddeix1y", label: "Sensor nível A", type: "dispositivo" }],
              },
            ],
          },
          {
            id: "t-comum",
            label: "Área comum",
            type: "torre",
            children: [
              {
                id: "r-cis",
                label: "Cisterna coletora",
                type: "reservatório",
                children: [
                  { id: "vdevo177204595020032", label: "Sensor nível cisterna", type: "dispositivo" },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}

export function getMockTeam(): TeamMemberRow[] {
  return [
    {
      id: "u1",
      name: "Igor Brandão",
      email: "admin@hidroparceiros.com",
      role: "Administrador",
      lastAccess: new Date().toISOString(),
      status: "ativo",
    },
    {
      id: "u2",
      name: "Operação Campo",
      email: "campo@hidroparceiros.com",
      role: "Operador",
      lastAccess: new Date(Date.now() - 7200000).toISOString(),
      status: "ativo",
    },
    {
      id: "u3",
      name: "Síndico (convite)",
      email: "sindico@aguasclaras.org",
      role: "Leitura",
      lastAccess: "—",
      status: "convite",
    },
  ];
}

export function getMockAudit(): AuditRow[] {
  return [
    {
      id: "a1",
      at: new Date(Date.now() - 900000).toISOString(),
      actor: "admin@hidroparceiros.com",
      action: "Atualizou limite de alerta",
      resource: "Reservatório eb689…",
    },
    {
      id: "a2",
      at: new Date(Date.now() - 86400000).toISOString(),
      actor: "campo@hidroparceiros.com",
      action: "Exportou relatório PDF",
      resource: "Relatório consumo mar/2026",
    },
    {
      id: "a3",
      at: new Date(Date.now() - 172800000).toISOString(),
      actor: "admin@hidroparceiros.com",
      action: "Convidou usuário",
      resource: "sindico@aguasclaras.org",
    },
  ];
}

export function getMockWebhooks(): WebhookRow[] {
  return [
    {
      id: "w1",
      url: "https://api.parceiro.com/hooks/hydroview",
      events: "alert.created, device.offline",
      status: "ativo",
      lastDelivery: new Date(Date.now() - 120000).toISOString(),
    },
    {
      id: "w2",
      url: "https://staging.parceiro.com/webhook",
      events: "telemetry.batch",
      status: "pausado",
      lastDelivery: "—",
    },
  ];
}

export function getMockReports(): ReportTemplateRow[] {
  return [
    {
      id: "r1",
      name: "Consumo semanal por torre",
      schedule: "Toda segunda, 08:00",
      format: "PDF",
      lastRun: new Date(Date.now() - 604800000).toISOString(),
    },
    {
      id: "r2",
      name: "Níveis — export CSV",
      schedule: "Manual",
      format: "CSV",
      lastRun: new Date(Date.now() - 259200000).toISOString(),
    },
  ];
}

export function getMockBillingSummary() {
  return {
    plan: "Profissional",
    nextCharge: "2026-04-01",
    amount: "R$ 489,00",
    meters: "48 dispositivos · 12 condomínios",
    status: "em dia" as const,
  };
}
