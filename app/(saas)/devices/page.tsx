import { DevicesScreen } from "@/components/screens";
import { getTuyaDevices } from "@/lib/services/tuya";

export const metadata = { title: "Dispositivos | HydroView" };
export const dynamic = "force-dynamic";

export default async function DevicesPage() {
  const devices = await getTuyaDevices();
  return <DevicesScreen devices={devices} />;
}
