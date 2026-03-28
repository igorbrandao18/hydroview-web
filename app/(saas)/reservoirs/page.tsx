import { ReservoirsScreen } from "@/components/screens";
import { getTuyaDevices } from "@/lib/services/tuya";

export const metadata = { title: "Reservatórios | HydroView" };
export const dynamic = "force-dynamic";

export default async function ReservoirsPage() {
  const devices = await getTuyaDevices().catch((err) => {
    console.error("[reservoirs page]", err);
    return [];
  });
  return <ReservoirsScreen devices={devices} />;
}
