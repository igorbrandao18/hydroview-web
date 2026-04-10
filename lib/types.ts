/** Modelo alinhado ao MVP: parceiro → condomínio → pontos de monitoramento (sensores / assets). */

export type AlertLevel = "ok" | "warning" | "critical";

export type TenantContext = {
  partnerName: string;
  condominiumName: string;
  condominiumSlug: string;
};

export type DataPoint = {
  code: string;
  label: string;
  value: string | number | boolean;
  unit?: string;
  /** Timestamp da última atualização deste DP (ms epoch) */
  updatedAt?: number;
};

export type ReservoirDevice = {
  id: string;
  name: string;
  role: "caixa" | "cisterna" | "outro";
  online: boolean;
  levelPercent: number;
  liquidState: "normal" | "lower_alarm" | "upper_alarm" | string;
  depthMm?: number;
  installationHeightMm?: number;
  liquidDepthMaxMm?: number;
  /** Limiares de alarme configurados no sensor (%) */
  alarmUpperPct?: number;
  alarmLowerPct?: number;
  upperSwitchEnabled?: boolean;
  autonomyHint?: string;
  lastUpdate: string;
  activeTime?: number;
  updateTime?: number;
  productName?: string;
  category?: string;
  serialNumber?: string;
  spaceName?: string;
  signalDb?: number;
  batteryPercent?: number;
  dataPoints: DataPoint[];
};

export type DashboardAlert = {
  id: string;
  title: string;
  message: string;
  level: AlertLevel;
  at: string;
};

/** Ponto no gráfico histórico de nível */
export type LevelHistoryPoint = {
  time: string;     // "HH:mm"
  timestamp: number; // ms epoch
  levelPercent: number;
  depthMm: number;
};

export type DeviceHistory = {
  deviceId: string;
  deviceName: string;
  installationHeightMm: number;
  alarmUpperPct: number;
  alarmLowerPct: number;
  points: LevelHistoryPoint[];
};

export type DashboardPayload = {
  context: TenantContext;
  reservoirs: ReservoirDevice[];
  alerts: DashboardAlert[];
  roadmapNote: string;
};
