import { AlertsScreen } from "@/components/screens";
import { getTuyaDevices, generateAlerts } from "@/lib/services/tuya";

export const metadata = { title: "Alertas | HydroView" };
export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const devices = await getTuyaDevices().catch((err) => {
    console.error("[alerts page]", err);
    return [];
  });
  const alerts = generateAlerts(devices);
  return <AlertsScreen alerts={alerts} />;
}
