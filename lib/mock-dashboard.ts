import type { DashboardPayload } from "./types";

/** Dados de demonstração — substituir por API e fila de eventos no backend. */
export function getMockDashboard(): DashboardPayload {
  return {
    context: {
      partnerName: "HidroParceiros Ltda",
      condominiumName: "Residencial Águas Claras",
      condominiumSlug: "aguas-claras",
    },
    reservoirs: [
      {
        id: "eb689eaa949930eddeix1y",
        name: "Caixa d'água — bloco A",
        role: "caixa",
        online: true,
        levelPercent: 33,
        liquidState: "normal",
        depthMm: 663,
        autonomyHint: "~36 h com consumo médio do condomínio (estimativa MVP)",
        lastUpdate: new Date().toISOString(),
        dataPoints: [
          { code: "liquid_level_percent", label: "Nível", value: 33, unit: "%" },
          { code: "liquid_depth", label: "Profundidade", value: 663, unit: "mm" },
          { code: "liquid_state", label: "Estado", value: "normal" },
          { code: "installation_height", label: "Altura instal.", value: 2500, unit: "mm" },
        ],
      },
      {
        id: "vdevo177204595020032",
        name: "Cisterna coletora",
        role: "cisterna",
        online: true,
        levelPercent: 72,
        liquidState: "normal",
        depthMm: 1240,
        autonomyHint: "Reserva estável — sem alerta de ruptura prevista",
        lastUpdate: new Date().toISOString(),
        dataPoints: [
          { code: "liquid_level_percent", label: "Nível", value: 72, unit: "%" },
          { code: "liquid_depth", label: "Profundidade", value: 1240, unit: "mm" },
          { code: "liquid_state", label: "Estado", value: "normal" },
        ],
      },
    ],
    alerts: [
      {
        id: "1",
        title: "Limite inferior histórico",
        message:
          "A caixa A chegou a 18% na terça. Configure alertas por WhatsApp na fase 2 do MVP.",
        level: "warning",
        at: "2026-03-26T08:12:00.000Z",
      },
      {
        id: "2",
        title: "Integração de sensores",
        message:
          "Este painel usa dados mock. Conecte o backend e a fila de eventos para telemetria real.",
        level: "ok",
        at: new Date().toISOString(),
      },
    ],
    roadmapNote:
      "Próximos passos: assets por parceiro > condomínio > reservatório, webhooks de status e histórico em banco próprio.",
  };
}
