import { LoginForm } from "./login-form";

export const metadata = { title: "Entrar | HydroView" };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] sm:text-3xl">
            HydroView
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Monitoramento inteligente de água
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
