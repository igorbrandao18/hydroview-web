import { SaasShell } from "@/components/saas-shell";

export default function SaasLayout({ children }: { children: React.ReactNode }) {
  return <SaasShell>{children}</SaasShell>;
}
