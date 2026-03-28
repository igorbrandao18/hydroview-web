import { DevicesScreen } from "@/components/screens";
import { getTuyaDevices } from "@/lib/services/tuya";

export const metadata = { title: "Dispositivos | HydroView" };
export const dynamic = "force-dynamic";

export default async function DevicesPage() {
  let devices = await getTuyaDevices().catch((err) => {
    console.error("[devices page]", err);
    return [];
  });
  return <DevicesScreen devices={devices} />;
}
