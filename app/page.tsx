import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-[var(--background-muted)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--accent-glow),transparent)]" />
      <header className="relative z-10 border-b border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <span className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg text-[var(--foreground)] sm:text-xl">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-xs font-bold text-[var(--accent-foreground)] sm:h-9 sm:w-9 sm:text-sm">
              H₂O
            </span>
            HydroView
          </span>
          <Link
            href="/dashboard"
            className="rounded-lg bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-[var(--accent-foreground)] shadow-sm transition hover:opacity-90 sm:px-4 sm:text-sm"
          >
            Abrir console
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-6xl flex-1 flex-col justify-center px-4 py-10 sm:px-6 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-deep)] sm:text-sm">
          SaaS para condomínios
        </p>
        <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-2xl leading-[1.1] tracking-tight text-[var(--foreground)] sm:mt-4 sm:text-4xl lg:text-5xl xl:text-6xl">
          Monitoramento de água com sensores{" "}
          <span className="text-[var(--accent-deep)]">IoT</span> na nuvem.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:mt-6 sm:text-base lg:text-lg">
          Plataforma para empresas parceiras: cada condomínio com seu painel de caixas,
          cisternas, alertas de nível e estimativa de autonomia — com telemetria dos sensores
          atualizada a cada acesso.
        </p>
        <div className="mt-6 sm:mt-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--foreground)] px-5 py-2.5 text-sm font-semibold text-[var(--background)] transition hover:opacity-90 sm:px-6 sm:py-3"
          >
            Entrar no painel
          </Link>
        </div>
      </main>
    </div>
  );
}
