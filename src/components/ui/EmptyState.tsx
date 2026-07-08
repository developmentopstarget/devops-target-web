import type { ReactNode } from "react";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={[
        "flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-surface px-6 py-12 text-center",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon && (
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-2 text-tertiary">
          {icon}
        </span>
      )}
      <h3 className="text-[15px] font-semibold text-primary">{title}</h3>
      {description && <p className="max-w-sm text-sm text-secondary">{description}</p>}
      {action}
    </div>
  );
}
