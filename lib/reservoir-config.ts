/**
 * Configuração de limiares operacionais por reservatório.
 * Valores em metros — alimentam as linhas de referência do gráfico.
 *
 * Fonte: gestor (Samuel/Adriano) — condomínio Comfort, Fortaleza-CE.
 * Quando houver multi-tenant, cada reservatório terá sua própria config no banco.
 */

export type ReservoirThresholds = {
  /** Nome do ponto / condomínio */
  label: string;
  /** Limite superior do reservatório (m) */
  limiteSuperior: number;
  /** Ponto de overflow / ladrão (m) */
  extravasador: number;
  /** Recarga máxima (extravasador − 20cm) */
  recargaMaxima: number;
  /** Recarga mínima */
  recargaMinima: number;
  /** Nível crítico — meio do volume útil (m) */
  nivelCritico: number;
  /** Altura útil de água (m) */
  alturaUtil: number;
  /** Volume morto / reserva de incêndio (m) */
  reservaTecnica: number;
};

/** Limiares padrão — Comfort, Fortaleza-CE */
const COMFORT: ReservoirThresholds = {
  label: "Comfort",
  limiteSuperior: 2.80,
  extravasador: 2.30,
  recargaMaxima: 2.10,
  recargaMinima: 1.80,
  nivelCritico: 0.60,
  alturaUtil: 1.15,
  reservaTecnica: 0.95,
};

/**
 * Mapa de device_id → thresholds.
 * Por enquanto todos usam os limiares do Comfort.
 * No futuro, cada reservatório terá sua configuração no banco.
 */
const configByDevice: Record<string, ReservoirThresholds> = {};

/** Retorna thresholds para um device — fallback para Comfort. */
export function getThresholds(deviceId: string): ReservoirThresholds {
  return configByDevice[deviceId] ?? COMFORT;
}
