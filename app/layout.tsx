import type { Metadata } from "next";
import { Lexend, Literata } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-sans-body",
  subsets: ["latin"],
  display: "swap",
});

const literata = Literata({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HydroView — Supervisório de água",
  description: "SaaS de monitoramento hídrico para condomínios — painel, alertas e backend próprio (MVP).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${lexend.variable} ${literata.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-sans-body)]">
        {children}
      </body>
    </html>
  );
}
