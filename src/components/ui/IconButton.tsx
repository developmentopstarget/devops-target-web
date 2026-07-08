import type { ButtonHTMLAttributes, ReactNode } from "react";

export type IconButtonVariant = "default" | "primary";
export type IconButtonSize = "sm" | "md";

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  icon: ReactNode;
  label: string;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
  className?: string;
}

const sizeClasses: Record<IconButtonSize, string> = {
  sm: "h-8 w-8",
  md: "h-9.5 w-9.5",
};

const variantClasses: Record<IconButtonVariant, string> = {
  default: "bg-transparent text-secondary hover:bg-surface-2 hover:text-primary",
  primary: "bg-accent text-white hover:bg-accent-hover",
};

export function iconButtonClassName({
  size = "md",
  variant = "default",
  className,
}: {
  size?: IconButtonSize;
  variant?: IconButtonVariant;
  className?: string;
} = {}) {
  return [
    "relative inline-flex items-center justify-center rounded-full transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
    "disabled:opacity-50 disabled:pointer-events-none",
    sizeClasses[size],
    variantClasses[variant],
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function IconButton({
  icon,
  label,
  size = "md",
  variant = "default",
  className,
  ...rest
}: IconButtonProps) {
  return (
    <button aria-label={label} className={iconButtonClassName({ size, variant, className })} {...rest}>
      {icon}
    </button>
  );
}
