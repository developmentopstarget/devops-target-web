import type { ReactNode } from "react";

export type BadgeVariant = "neutral" | "accent" | "success" | "warning" | "danger" | "info";

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "bg-surface-2 text-secondary",
  accent: "bg-accent-soft text-accent",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  info: "bg-info/15 text-info",
};

export function Badge({ variant = "neutral", children, className }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-[7px] px-2 py-1 text-[10.5px] font-bold uppercase tracking-wide",
        variantClasses[variant],
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
