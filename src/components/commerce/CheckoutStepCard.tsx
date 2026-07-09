import type { ReactNode } from "react";

export interface CheckoutStepCardProps {
  step: number;
  title: string;
  children: ReactNode;
  className?: string;
}

export function CheckoutStepCard({ step, title, children, className }: CheckoutStepCardProps) {
  return (
    <fieldset
      className={[
        "rounded-xl border border-border bg-surface p-4.5 shadow-sm",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <legend className="mb-3.5 flex items-center gap-2 px-0 text-[15px] font-bold text-primary">
        <span className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-xs font-bold text-white">
          {step}
        </span>
        {title}
      </legend>
      {children}
    </fieldset>
  );
}
