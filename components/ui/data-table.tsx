import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function DataTable({ children, className = "" }: Props) {
  return (
    <div className={`overflow-x-auto rounded-xl border border-[var(--border)] ${className}`}>
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">{children}</table>
    </div>
  );
}

export function DataTableHead({ children }: { children: ReactNode }) {
  return (
    <thead className="border-b border-[var(--border)] bg-[var(--surface-elevated)] text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
      {children}
    </thead>
  );
}

export function DataTableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">{children}</tbody>;
}

export function DataTableRow({ children }: { children: ReactNode }) {
  return <tr className="transition hover:bg-[var(--surface-elevated)]/50">{children}</tr>;
}

export function DataTableTh({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <th className={`px-4 py-3 ${className}`}>{children}</th>;
}

export function DataTableTd({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`px-4 py-3 text-[var(--foreground)] ${className}`}>{children}</td>;
}
