import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: Props) {
  return (
    <header className="mb-3 flex flex-col gap-2 sm:mb-4 sm:gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-xs font-medium text-[var(--accent-deep)] sm:text-sm">{eyebrow}</p>
        ) : null}
        <h1 className="mt-0.5 font-[family-name:var(--font-display)] text-xl tracking-tight text-[var(--foreground)] sm:mt-1 sm:text-2xl md:text-3xl">
          {title}
        </h1>
        {description ? (
          <div className="mt-2 text-[var(--muted)] leading-relaxed">{description}</div>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}
