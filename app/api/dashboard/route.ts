import { NextResponse } from "next/server";
import type { ApiErrorBody } from "@/lib/api-types";
import type { DashboardPayload } from "@/lib/types";
import { getMockDashboard } from "@/lib/mock-dashboard";
import { getTuyaDashboard } from "@/lib/services/tuya";

/**
 * Payload do painel — dados reais da Tuya Cloud com fallback para mock.
 * Formato documentado em `lib/types.ts` (`DashboardPayload`).
 */
export async function GET(): Promise<NextResponse<DashboardPayload | ApiErrorBody>> {
  try {
    const mock = getMockDashboard();

    const { reservoirs } = await getTuyaDashboard();

    const data: DashboardPayload = {
      ...mock,
      reservoirs: reservoirs.length > 0 ? reservoirs : mock.reservoirs,
      alerts:
        reservoirs.length > 0
          ? mock.alerts.filter((a) => a.id !== "2") // remove aviso de dados mock
          : mock.alerts,
    };

    return NextResponse.json(data);
  } catch (err) {
    console.error("[dashboard] Falha ao buscar dados Tuya:", err);
    // fallback para mock em caso de erro de credenciais ou rede
    try {
      return NextResponse.json(getMockDashboard());
    } catch {
      const body: ApiErrorBody = { error: "Não foi possível carregar o painel." };
      return NextResponse.json(body, { status: 500 });
    }
  }
}
