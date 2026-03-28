import { DashboardScreen } from "@/components/screens";
import { getTuyaDashboard } from "@/lib/services/tuya";

export const metadata = {
  title: "Início | HydroView",
  description: "Monitoramento de reservatórios e alertas (MVP).",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { reservoirs } = await getTuyaDashboard().catch((err) => {
    console.error("[dashboard page]", err);
    return { reservoirs: [] };
  });
  return <DashboardScreen reservoirs={reservoirs} />;
}
