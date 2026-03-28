import { DashboardScreen } from "@/components/screens";
import { getTuyaDashboard } from "@/lib/services/tuya";

export const metadata = {
  title: "Início | HydroView",
  description: "Monitoramento de reservatórios e alertas (MVP).",
};

// Sempre busca dados frescos da Tuya a cada requisição
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { reservoirs } = await getTuyaDashboard();

  return (
    <DashboardScreen
      reservoirs={reservoirs}
    />
  );
}
