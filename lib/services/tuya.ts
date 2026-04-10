/**
 * Serviço de integração com a Tuya Cloud — usa o script
 * lib/services/tuya-sequence.mjs como fonte de verdade.
 *
 * Variáveis de ambiente necessárias (web/.env.local ou Vercel env vars):
 *   TUYA_ACCESS_KEY  — Access ID do projeto Cloud
 *   TUYA_SECRET_KEY  — Secret do projeto Cloud
 *   TUYA_BASE_URL    — ex.: https://openapi.tuyaus.com
 */

import { createRequire } from "node:module";
import {
  loadDotEnv,
  creds,
  stepListProjectDevices,
} from "./tuya-sequence.mjs";
import type { ReservoirDevice, DataPoint, DashboardAlert, DashboardPayload, DeviceHistory, LevelHistoryPoint } from "@/lib/types";

// ─── Tipos internos ────────────────────────────────────────────────────────────

type TuyaCtx = {
  client: { init: () => Promise<unknown> };
  request: (opt: {
    path: string;
    method: string;
    query?: Record<string, unknown>;
  }) => Promise<unknown>;
};

type TuyaListDevice = {
  id: string;
  name?: string;
  isOnline?: boolean;
  is_online?: boolean;
  online?: boolean;
  productName?: string;
  category?: string;
  activeTime?: number;
  updateTime?: number;
  bindSpaceId?: string;
  bind_space_id?: string;
};

/** Resposta do IoT Core GET /v1.0/iot-03/devices/{id} */
type IotCoreDetail = {
  id: string;
  name?: string;          // custom_name definido pelo usuário
  online?: boolean;
  product_id?: string;
  product_name?: string;
  category?: string;
  sn?: string;            // número de série
  active_time?: number;
  update_time?: number;
  ip?: string;
  lat?: string;
  lon?: string;
  time_zone?: string;
};

/** Shadow property com timestamp individual por DP */
type ShadowProp = {
  code: string;
  value: unknown;
  time?: number;          // ms epoch da última atualização deste DP
  type?: string;
};

// ─── Mapa de labels pt-BR para DPs conhecidos ──────────────────────────────────

const DP_LABELS: Record<string, { label: string; unit?: string }> = {
  liquid_level_percent: { label: "Nível",               unit: "%" },
  liquid_depth:         { label: "Profundidade",        unit: "mm" },
  liquid_state:         { label: "Estado" },
  liquid_depth_max:     { label: "Prof. máxima",        unit: "mm" },
  installation_height:  { label: "Altura instalada",    unit: "mm" },
  max_set:              { label: "Alarme superior",     unit: "%" },
  mini_set:             { label: "Alarme inferior",     unit: "%" },
  upper_switch:         { label: "Alarme sup. ativo" },
  battery_percentage:   { label: "Bateria",             unit: "%" },
  battery_state:        { label: "Estado bateria" },
  temp_current:         { label: "Temperatura",         unit: "°C" },
  humidity_value:       { label: "Umidade",             unit: "%" },
  signal_strength:      { label: "Sinal",               unit: "dBm" },
  rssi:                 { label: "RSSI",                unit: "dBm" },
};

const LIQUID_STATE_PT: Record<string, string> = {
  normal:      "Normal",
  lower_alarm: "Nível baixo",
  upper_alarm: "Nível alto",
};

// ─── Singleton ─────────────────────────────────────────────────────────────────

const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { TuyaContext } = require("@tuya/tuya-connector-nodejs") as {
  TuyaContext: new (opt: {
    baseUrl: string;
    accessKey: string;
    secretKey: string;
    version?: string;
  }) => TuyaCtx;
};

let ctx: TuyaCtx | null = null;

async function getCtx(): Promise<TuyaCtx> {
  if (ctx) return ctx;
  loadDotEnv();
  const { accessKey, secretKey, baseUrl } = creds();
  const instance = new TuyaContext({ baseUrl, accessKey, secretKey, version: "v2" });
  await instance.client.init();
  ctx = instance;
  return instance;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Descarta strings com caracteres CJK (chinês/japonês/coreano). */
function noCJK(text: string | undefined): string | undefined {
  if (!text) return undefined;
  return /[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF]/.test(text) ? undefined : text;
}

function shadowNum(props: ShadowProp[], code: string): number | undefined {
  const v = props.find((p) => p.code === code)?.value;
  return typeof v === "number" ? v : undefined;
}

function shadowStr(props: ShadowProp[], code: string): string | undefined {
  const v = props.find((p) => p.code === code)?.value;
  return typeof v === "string" ? v : undefined;
}

function shadowBool(props: ShadowProp[], code: string): boolean | undefined {
  const v = props.find((p) => p.code === code)?.value;
  return typeof v === "boolean" ? v : undefined;
}

function shadowTime(props: ShadowProp[], code: string): number | undefined {
  return props.find((p) => p.code === code)?.time;
}

function isOnline(d: TuyaListDevice): boolean {
  return d.isOnline === true || d.is_online === true || (d.online as unknown) === true;
}

function inferRole(name: string): ReservoirDevice["role"] {
  const n = name.toLowerCase();
  if (n.includes("cistern") || n.includes("cist")) return "cisterna";
  if (n.includes("caixa") || n.includes("tank") || n.includes("reserv")) return "caixa";
  return "outro";
}

function calcAutonomy(levelPercent: number, liquidState: string, alarmLowerPct?: number): string {
  const lower = alarmLowerPct ?? 20;
  if (liquidState === "lower_alarm" || levelPercent <= lower) {
    return `Nível crítico (abaixo de ${lower}%) — abastecimento urgente.`;
  }
  if (liquidState === "upper_alarm") {
    return "Reservatório acima do limite superior — verificar entrada.";
  }
  if (levelPercent >= 85) return "Reservatório cheio — sem necessidade de ação.";
  const hours = Math.round(levelPercent / 2);
  return `Estimativa de ~${hours}h de autonomia com consumo médio.`;
}

// ─── Chamadas à API ────────────────────────────────────────────────────────────

/** IoT Core detail — retorna custom_name e sn. */
async function fetchIotDetail(c: TuyaCtx, deviceId: string): Promise<IotCoreDetail | null> {
  try {
    const res = (await c.request({
      path: `/v1.0/iot-03/devices/${deviceId}`,
      method: "GET",
    })) as { success?: boolean; result?: IotCoreDetail };
    if (res?.success && res.result) return res.result;
  } catch { /* indisponível */ }
  return null;
}

/** Shadow properties — todos os DPs com timestamps individuais. */
async function fetchShadowProps(c: TuyaCtx, deviceId: string): Promise<ShadowProp[]> {
  try {
    const res = (await c.request({
      path: `/v2.0/cloud/thing/${deviceId}/shadow/properties`,
      method: "GET",
    })) as { success?: boolean; result?: { properties?: ShadowProp[] } };
    if (res?.success && Array.isArray(res.result?.properties)) {
      return res.result.properties;
    }
  } catch { /* indisponível */ }
  return [];
}

/** Nome do space/asset ao qual o device está vinculado. */
async function fetchSpaceName(c: TuyaCtx, spaceId: string): Promise<string | undefined> {
  try {
    const res = (await c.request({
      path: `/v2.0/cloud/space/${spaceId}`,
      method: "GET",
    })) as { success?: boolean; result?: { name?: string } };
    const name = res?.result?.name;
    return noCJK(name);
  } catch { /* indisponível */ }
  return undefined;
}

/** Monta DataPoints com labels pt-BR e timestamp por DP. */
function buildDataPoints(props: ShadowProp[]): DataPoint[] {
  return props.map((p) => {
    const known = DP_LABELS[p.code];
    const label = known?.label ?? p.code.replace(/_/g, " ");
    const unit  = known?.unit;

    let value: string | number | boolean = p.value as string | number | boolean;
    if (p.code === "liquid_state" && typeof value === "string") {
      value = LIQUID_STATE_PT[value] ?? value;
    }
    if (p.code === "upper_switch") {
      value = value ? "Sim" : "Não";
    }

    return { code: p.code, label, value, unit, updatedAt: p.time };
  });
}

/** Monta um ReservoirDevice completo a partir de todas as fontes Tuya. */
function mapDevice(
  d: TuyaListDevice,
  iot: IotCoreDetail | null,
  props: ShadowProp[],
  spaceName: string | undefined,
): ReservoirDevice {
  const levelPercent   = shadowNum(props, "liquid_level_percent") ?? 0;
  const depthMm        = shadowNum(props, "liquid_depth");
  const installHeightMm = shadowNum(props, "installation_height");
  const liquidDepthMaxMm = shadowNum(props, "liquid_depth_max");
  const alarmUpperPct  = shadowNum(props, "max_set");
  const alarmLowerPct  = shadowNum(props, "mini_set");
  const upperSwitch    = shadowBool(props, "upper_switch");
  const batteryPercent = shadowNum(props, "battery_percentage");
  const signalDb       = shadowNum(props, "signal_strength") ?? shadowNum(props, "rssi");
  const rawState       = shadowStr(props, "liquid_state") ?? "normal";
  const lastDpTime     = shadowTime(props, "liquid_depth") ?? shadowTime(props, "liquid_level_percent");

  // Nome: prefere custom_name do IoT Core (definido pelo usuário)
  const rawName = noCJK(iot?.name) ?? noCJK(d.name) ?? d.id;
  const productName = noCJK(iot?.product_name ?? d.productName);
  const category    = noCJK(iot?.category ?? d.category);
  const serialNumber = iot?.sn;

  return {
    id:     d.id,
    name:   rawName,
    role:   inferRole(rawName),
    online: iot?.online ?? isOnline(d),
    levelPercent,
    liquidState: rawState,
    depthMm,
    installationHeightMm: installHeightMm,
    liquidDepthMaxMm,
    alarmUpperPct,
    alarmLowerPct,
    upperSwitchEnabled: upperSwitch,
    autonomyHint: calcAutonomy(levelPercent, rawState, alarmLowerPct),
    lastUpdate: lastDpTime ? new Date(lastDpTime).toISOString() : new Date().toISOString(),
    activeTime:  iot?.active_time ?? d.activeTime,
    updateTime:  iot?.update_time ?? d.updateTime,
    productName,
    category,
    serialNumber,
    spaceName,
    batteryPercent,
    signalDb,
    dataPoints: buildDataPoints(props),
  };
}

// ─── Geração de alertas a partir dos estados reais ─────────────────────────────

export function generateAlerts(reservoirs: ReservoirDevice[]): DashboardAlert[] {
  const alerts: DashboardAlert[] = [];
  const now = new Date().toISOString();

  for (const r of reservoirs) {
    if (!r.online) {
      alerts.push({
        id:      `offline-${r.id}`,
        title:   `${r.name} — sem sinal`,
        message: `O dispositivo está fora de comunicação. Verifique a alimentação e a rede.`,
        level:   "critical",
        at:      now,
      });
      continue;
    }
    if (r.liquidState === "lower_alarm") {
      alerts.push({
        id:      `lower-${r.id}`,
        title:   `${r.name} — nível baixo`,
        message: `Nível em ${r.levelPercent}%, abaixo do limiar inferior (${r.alarmLowerPct ?? 20}%). Providenciar abastecimento.`,
        level:   "critical",
        at:      now,
      });
    } else if (r.liquidState === "upper_alarm") {
      alerts.push({
        id:      `upper-${r.id}`,
        title:   `${r.name} — nível alto`,
        message: `Nível em ${r.levelPercent}%, acima do limiar superior (${r.alarmUpperPct ?? 90}%). Verificar válvula de entrada.`,
        level:   "warning",
        at:      now,
      });
    } else if (r.levelPercent > 0 && r.levelPercent <= 25) {
      alerts.push({
        id:      `low-${r.id}`,
        title:   `${r.name} — atenção ao nível`,
        message: `Nível em ${r.levelPercent}%. Monitorar nas próximas horas.`,
        level:   "warning",
        at:      now,
      });
    }
  }

  if (alerts.length === 0) {
    alerts.push({
      id:      "all-ok",
      title:   "Todos os reservatórios normais",
      message: "Nenhum alerta ativo no momento.",
      level:   "ok",
      at:      now,
    });
  }

  return alerts;
}

// ─── API pública ───────────────────────────────────────────────────────────────

/** Busca todos os dispositivos com dados completos da Tuya. */
export async function getTuyaDevices(): Promise<ReservoirDevice[]> {
  const c = await getCtx();
  const list = (await stepListProjectDevices(c)) as TuyaListDevice[];

  return Promise.all(
    list.map(async (d) => {
      const spaceId = d.bindSpaceId ?? d.bind_space_id;
      const [iot, props, spaceName] = await Promise.all([
        fetchIotDetail(c, d.id),
        fetchShadowProps(c, d.id),
        spaceId ? fetchSpaceName(c, spaceId) : Promise.resolve(undefined),
      ]);
      return mapDevice(d, iot, props, spaceName);
    })
  );
}

/** Alias usado pelo dashboard. */
export async function getTuyaDashboard(): Promise<Pick<DashboardPayload, "reservoirs">> {
  const reservoirs = await getTuyaDevices();
  return { reservoirs };
}

// ─── Histórico de nível (report-logs v2) ───────────────────────────────────────

type ReportLog = { code: string; event_time: number; value: string };
type ReportLogsRes = {
  success?: boolean;
  result?: { logs?: ReportLog[]; has_more?: boolean; last_row_key?: string };
};

/** Busca logs de nível das últimas 24h via /v2.0/cloud/thing/{id}/report-logs. */
async function fetchReportLogs(
  c: TuyaCtx,
  deviceId: string,
  codes: string,
  hours = 24,
): Promise<ReportLog[]> {
  const now = Date.now();
  const start = now - hours * 60 * 60 * 1000;
  const all: ReportLog[] = [];
  let lastRowKey: string | undefined;

  for (let page = 0; page < 10; page++) {
    const query: Record<string, unknown> = {
      start_time: start,
      end_time: now,
      codes,
      size: 100,
    };
    if (lastRowKey) query.last_row_key = lastRowKey;

    const res = (await c.request({
      path: `/v2.0/cloud/thing/${deviceId}/report-logs`,
      method: "GET",
      query,
    })) as ReportLogsRes;

    if (!res?.success || !res.result?.logs) break;
    all.push(...res.result.logs);
    if (!res.result.has_more) break;
    lastRowKey = res.result.last_row_key;
    if (!lastRowKey) break;
  }

  return all;
}

/** Retorna pontos de histórico para o gráfico de nível de um dispositivo. */
export async function getDeviceHistory(deviceId: string): Promise<DeviceHistory | null> {
  const c = await getCtx();

  const [logs, props, iot] = await Promise.all([
    fetchReportLogs(c, deviceId, "liquid_level_percent,liquid_depth"),
    fetchShadowProps(c, deviceId),
    fetchIotDetail(c, deviceId),
  ]);

  const installHeight = shadowNum(props, "installation_height") ?? 2500;
  const alarmUpper    = shadowNum(props, "max_set") ?? 90;
  const alarmLower    = shadowNum(props, "mini_set") ?? 20;
  const deviceName    = noCJK(iot?.name) ?? deviceId;

  // Agrupar logs por minuto: juntar liquid_level_percent + liquid_depth do mesmo horário
  const byTime = new Map<number, { levelPercent?: number; depthMm?: number }>();

  for (const log of logs) {
    // Arredondar para minuto
    const minute = Math.floor(log.event_time / 60000) * 60000;
    const entry = byTime.get(minute) ?? {};
    const val = Number(log.value);
    if (log.code === "liquid_level_percent") entry.levelPercent = val;
    if (log.code === "liquid_depth") entry.depthMm = val;
    byTime.set(minute, entry);
  }

  // Ordenar por tempo e formatar
  const sorted = [...byTime.entries()].sort((a, b) => a[0] - b[0]);
  const points: LevelHistoryPoint[] = sorted
    .filter(([, v]) => v.levelPercent !== undefined)
    .map(([ts, v]) => ({
      timestamp: ts,
      time: new Date(ts).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      levelPercent: v.levelPercent ?? 0,
      depthMm: v.depthMm ?? 0,
    }));

  return {
    deviceId,
    deviceName,
    installationHeightMm: installHeight,
    alarmUpperPct: alarmUpper,
    alarmLowerPct: alarmLower,
    points,
  };
}
