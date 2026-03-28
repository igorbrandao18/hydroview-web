import { NextResponse } from "next/server";
import type { ApiErrorBody } from "@/lib/api-types";
import type { ReservoirDevice } from "@/lib/types";
import { getTuyaDevices } from "@/lib/services/tuya";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse<ReservoirDevice[] | ApiErrorBody>> {
  try {
    const devices = await getTuyaDevices();
    return NextResponse.json(devices);
  } catch {
    return NextResponse.json({ error: "Não foi possível carregar os dispositivos." }, { status: 500 });
  }
}
