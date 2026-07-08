import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  footer?: ReactNode;
  interactive?: boolean;
  children: ReactNode;
}

export function Card({ header, footer, interactive, children, className, ...rest }: CardProps) {
  return (
    <div
      className={[
        "rounded-xl border border-border bg-surface shadow-sm",
        interactive ? "transition-shadow hover:shadow-md" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {header && <div className="border-b border-border p-4">{header}</div>}
      <div className="p-4">{children}</div>
      {footer && <div className="border-t border-border p-4">{footer}</div>}
    </div>
  );
}
