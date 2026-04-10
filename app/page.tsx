import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-[var(--background-muted)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--accent-glow),transparent)]" />
      <header className="relative z-10 border-b border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <span className="flex items-center gap-2 font-[family-name:var(--font-display)] text-xl text-[var(--foreground)]">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent)] text-sm font-bold text-[var(--accent-foreground)]">
              H₂O
            </span>
            HydroView
          </span>
          <Link
            href="/login"
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-foreground)] shadow-sm transition hover:opacity-90"
          >
            Abrir console
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-6xl flex-1 flex-col justify-center px-4 py-20 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-deep)]">
          SaaS para condomínios
        </p>
        <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl leading-[1.1] tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
          Monitoramento de água com sensores{" "}
          <span className="text-[var(--accent-deep)]">IoT</span> na nuvem.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
          Plataforma para empresas parceiras: cada condomínio com seu painel de caixas,
          cisternas, alertas de nível e estimativa de autonomia — com telemetria dos sensores
          atualizada a cada acesso.
        </p>
        <div className="mt-10">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
          >
            Entrar no painel
          </Link>
        </div>
      </main>
    </div>
  );
}
