import type { DashboardPayload } from "./types";

/** Resposta de erro JSON das API routes — sem detalhes internos para o cliente. */
export type ApiErrorBody = {
  error: string;
};

export type DashboardApiResponse = DashboardPayload | ApiErrorBody;
