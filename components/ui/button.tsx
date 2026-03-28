import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variantClass: Record<Variant, string> = {
  primary:
    "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-sm hover:opacity-90 border border-transparent",
  secondary:
    "border border-[var(--border-strong)] bg-[var(--surface-elevated)] text-[var(--foreground)] hover:bg-[var(--surface)]",
  ghost: "text-[var(--muted)] hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)] border border-transparent",
  danger:
    "bg-[var(--alert-critical-strip)] text-white hover:opacity-90 border border-transparent",
};

type Size = "sm" | "md";

const sizeClass: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
};

type Base = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: Base & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-lg font-semibold transition ${variantClass[variant]} ${sizeClass[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

type LinkButtonProps = Base & { href: string } & Omit<React.ComponentProps<typeof Link>, "className">;

export function ButtonLink({ children, variant = "secondary", size = "md", className = "", href, ...props }: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-lg font-semibold transition ${variantClass[variant]} ${sizeClass[size]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
