#!/usr/bin/env node
/**
 * Sequência completa via Open API (não é login no site auth.tuya.com):
 *
 *   1) Autenticar — obtém access_token com Access ID + Secret do projeto Cloud.
 *   2) Listar dispositivos do projeto — GET /v2.0/cloud/thing/device (paginado).
 *   3) Detalhe por dispositivo — GET /v2.0/cloud/thing/{device_id}.
 *   4) Status (IoT Core) — GET /v1.0/iot-03/devices/{id}/status.
 *   5) IoT Core em lote — GET /v1.0/iot-03/devices?device_ids=… (IDs do passo 2; doc exige device_ids).
 *
 * Uso:
 *   cd tuya-mcp && node scripts/tuya-sequence.mjs
 *   node scripts/tuya-sequence.mjs --device=1   # detalhe/status do 1º da lista (índice 1-based)
 *   node scripts/tuya-sequence.mjs --device 2
 *
 * Credenciais: variáveis de ambiente ou arquivo .env nesta pasta (tuya-mcp/.env).
 */

import { createRequire } from "node:module";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { TuyaContext } = require("@tuya/tuya-connector-nodejs");

const __dir = dirname(fileURLToPath(import.meta.url));
const ENV_PATH = join(__dir, "..", ".env");

export function loadDotEnv() {
  if (!existsSync(ENV_PATH)) return;
  const raw = readFileSync(ENV_PATH, "utf8");
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (process.env[k] === undefined) process.env[k] = v;
  }
}

export function creds() {
  const accessKey = process.env.TUYA_ACCESS_KEY ?? process.env.TUYA_CLIENT_ID;
  const secretKey = process.env.TUYA_SECRET_KEY ?? process.env.TUYA_CLIENT_SECRET;
  const baseUrl = process.env.TUYA_BASE_URL ?? "https://openapi.tuyaus.com";
  if (!accessKey || !secretKey) {
    throw new Error(
      "Defina TUYA_ACCESS_KEY + TUYA_SECRET_KEY (ou CLIENT_ID/CLIENT_SECRET) em .env ou no ambiente."
    );
  }
  return { accessKey, secretKey, baseUrl };
}

function hr(title) {
  console.log("\n" + "=".repeat(60));
  console.log(title);
  console.log("=".repeat(60));
}

async function stepAuth(ctx, baseUrl) {
  hr("PASSO 1 — Autenticação (token Open API)");
  await ctx.client.init();
  console.log("Token obtido e cliente pronto.");
  console.log("Base URL:", baseUrl);
}

/**
 * Lista todos os dispositivos do projeto (API v2 cloud thing).
 * Doc: Query Devices in Project — GET /v2.0/cloud/thing/device
 */
export async function stepListProjectDevices(ctx) {
  hr("PASSO 2 — Listar dispositivos do projeto (GET /v2.0/cloud/thing/device)");
  const pageSize = 20;
  const all = [];
  let lastId;

  for (;;) {
    const query = { page_size: pageSize };
    if (lastId) query.last_id = lastId;

    const res = await ctx.request({
      path: "/v2.0/cloud/thing/device",
      method: "GET",
      query,
    });

    if (!res || res.success !== true) {
      console.log("Resposta:", summarize(res));
      throw new Error("Listagem v2 falhou (success !== true).");
    }

    const batch = Array.isArray(res.result) ? res.result : [];
    all.push(...batch);
    console.log(`  Página: +${batch.length} dispositivo(s) (total acumulado: ${all.length})`);

    if (batch.length < pageSize) break;
    lastId = batch[batch.length - 1]?.id;
    if (!lastId) break;
  }

  console.log(`Total: ${all.length} dispositivo(s).`);
  for (const d of all) {
    console.log(
      `  • ${d.name ?? "(sem nome)"} | id=${d.id} | online=${d.isOnline} | product=${d.productName ?? d.productId}`
    );
  }
  return all;
}

export async function stepDeviceDetail(ctx, deviceId) {
  const res = await ctx.request({
    path: `/v2.0/cloud/thing/${deviceId}`,
    method: "GET",
  });
  if (!res || res.success !== true) {
    console.log("  Detalhe v2:", summarize(res));
    return null;
  }
  return res.result;
}

export async function stepDeviceStatus(ctx, deviceId) {
  try {
    const res = await ctx.deviceStatus.status({ device_id: deviceId });
    return res;
  } catch (e) {
    return { _error: String(e?.message || e) };
  }
}

function summarize(obj) {
  if (obj == null) return String(obj);
  const s = JSON.stringify(obj);
  return s.length > 500 ? s.slice(0, 500) + "…" : s;
}

/** Lista v2 usa em geral `isOnline`; outras respostas podem usar `is_online` ou `online`. */
function isDeviceOnline(d) {
  if (!d || typeof d !== "object") return false;
  if (d.isOnline === true) return true;
  if (d.is_online === true) return true;
  if (d.online === true) return true;
  return false;
}

/** Primeiro dispositivo online na lista; senão o primeiro item (com aviso). */
function pickTargetDevice(devices) {
  const online = devices.find(isDeviceOnline);
  if (online) return { device: online, reason: "primeiro com online=true" };
  const fallback = devices[0];
  return {
    device: fallback,
    reason: "nenhum marcado online na lista — usando primeiro da lista",
  };
}

/** Índice 1-based: --device=3 ou --device 3 */
function parseDeviceIndex(argv = process.argv.slice(2)) {
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--device=")) {
      const n = parseInt(a.slice("--device=".length), 10);
      if (Number.isFinite(n) && n >= 1) return n;
    }
    if (a === "--device" || a === "-d") {
      const n = parseInt(argv[i + 1], 10);
      if (Number.isFinite(n) && n >= 1) return n;
    }
  }
  return null;
}

function pickDeviceByListIndex(devices, oneBased) {
  const i = oneBased - 1;
  if (i < 0 || i >= devices.length) {
    throw new Error(
      `Dispositivo ${oneBased} inexistente (lista tem ${devices.length} item(ns)).`
    );
  }
  return devices[i];
}

async function main() {
  loadDotEnv();
  const deviceIndex = parseDeviceIndex();
  const { accessKey, secretKey, baseUrl } = creds();

  const ctx = new TuyaContext({
    baseUrl,
    accessKey,
    secretKey,
    version: "v2",
  });

  await stepAuth(ctx, baseUrl);

  const devices = await stepListProjectDevices(ctx);

  if (devices.length === 0) {
    console.log("\nNenhum dispositivo para detalhar.");
    return;
  }

  let target;
  let reason;
  if (deviceIndex != null) {
    target = pickDeviceByListIndex(devices, deviceIndex);
    reason = `dispositivo ${deviceIndex} da lista (ordem do passo 2)`;
  } else {
    const picked = pickTargetDevice(devices);
    target = picked.device;
    reason = picked.reason;
  }

  hr(`PASSO 3 — Detalhe do dispositivo (GET /v2.0/cloud/thing/{device_id})`);
  console.log("Alvo:", reason);
  console.log("device_id:", target.id, "| nome:", target.name ?? "(sem nome)");
  const detail = await stepDeviceDetail(ctx, target.id);
  if (detail) {
    const online = detail.isOnline ?? detail.is_online ?? detail.online;
    console.log("Resumo:");
    console.log(
      `  name=${detail.name} category=${detail.category} uuid=${detail.uuid} online=${online}`
    );
    console.log("\nDetalhe completo (JSON — API v2 cloud/thing):\n");
    console.log(JSON.stringify(detail, null, 2));
  }

  hr("PASSO 3b — Detalhe IoT Core (GET /v1.0/iot-03/devices/{device_id})");
  try {
    const iotDetail = await ctx.device.detail({ device_id: target.id });
    console.log(JSON.stringify(iotDetail, null, 2));
  } catch (e) {
    console.log("  (indisponível ou erro)", String(e?.message || e));
  }

  hr("PASSO 4 — Status IoT Core (GET …/iot-03/devices/{id}/status)");
  const status = await stepDeviceStatus(ctx, target.id);
  if (status._error) {
    console.log("  Não disponível ou erro:", status._error);
  } else {
    console.log(JSON.stringify(status, null, 2));
  }

  hr(
    "PASSO 5 — IoT Core em lote GET /v1.0/iot-03/devices?device_ids=… (obrigatório na doc)"
  );
  try {
    const ids = devices.map((d) => d.id).filter(Boolean);
    const chunk = ids.slice(0, 20).join(",");
    const legacy = await ctx.request({
      path: "/v1.0/iot-03/devices",
      method: "GET",
      query: { device_ids: chunk },
    });
    if (legacy && legacy.success === true) {
      const list = legacy.result?.list ?? legacy.result;
      const n = Array.isArray(list) ? list.length : 0;
      console.log(`  OK — success=true, ${n} dispositivo(s) (iot-03 formato lista).`);
    } else {
      console.log("  Resposta:", summarize(legacy));
    }
  } catch (e) {
    console.log("  Erro:", String(e?.message || e));
  }

  console.log("\nSequência concluída.\n");
}

main().catch((e) => {
  console.error("\nFalha:", e.message || e);
  process.exit(1);
});
