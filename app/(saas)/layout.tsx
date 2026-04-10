import { SaasShell } from "@/components/saas-shell";
import { SessionProvider } from "@/components/session-provider";

export default function SaasLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SaasShell>{children}</SaasShell>
    </SessionProvider>
  );
}
