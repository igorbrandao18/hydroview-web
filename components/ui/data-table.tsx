import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function DataTable({ children, className = "" }: Props) {
  return (
    <div className={`-mx-2 overflow-x-auto rounded-lg border border-[var(--border)] sm:mx-0 sm:rounded-xl ${className}`}>
      <table className="w-full min-w-[480px] border-collapse text-left text-xs sm:min-w-[640px] sm:text-sm">{children}</table>
    </div>
  );
}

export function DataTableHead({ children }: { children: ReactNode }) {
  return (
    <thead className="border-b border-[var(--border)] bg-[var(--surface-elevated)] text-[9px] font-semibold uppercase tracking-wider text-[var(--muted)] sm:text-[10px]">
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
  return <th className={`px-2 py-2 sm:px-4 sm:py-3 ${className}`}>{children}</th>;
}

export function DataTableTd({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`px-2 py-2 text-[var(--foreground)] sm:px-4 sm:py-3 ${className}`}>{children}</td>;
}
