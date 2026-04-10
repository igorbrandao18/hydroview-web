import { NextRequest, NextResponse } from "next/server";
import type { ApiErrorBody } from "@/lib/api-types";
import type { DeviceHistory } from "@/lib/types";
import { getDeviceHistory } from "@/lib/services/tuya";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
): Promise<NextResponse<DeviceHistory | ApiErrorBody>> {
  const deviceId = req.nextUrl.searchParams.get("device_id");
  if (!deviceId) {
    return NextResponse.json({ error: "Parâmetro device_id obrigatório." }, { status: 400 });
  }

  try {
    const history = await getDeviceHistory(deviceId);
    if (!history) {
      return NextResponse.json({ error: "Dispositivo não encontrado." }, { status: 404 });
    }
    return NextResponse.json(history);
  } catch {
    return NextResponse.json({ error: "Não foi possível carregar o histórico." }, { status: 500 });
  }
}
