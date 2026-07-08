import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "link" | "onAccent";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

interface SharedProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  children?: ReactNode;
  className?: string;
}

type ButtonAsButton = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof SharedProps> & {
    as?: "button";
    href?: undefined;
  };

type ButtonAsAnchor = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof SharedProps> & {
    as: "a";
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover",
  secondary:
    "bg-surface text-primary border border-border-strong hover:bg-surface-2",
  ghost: "bg-transparent text-secondary hover:bg-surface-2 hover:text-primary",
  danger: "bg-danger text-white hover:opacity-90",
  link: "bg-transparent text-accent hover:text-accent-hover underline-offset-4 hover:underline p-0 h-auto",
  onAccent: "bg-white text-accent hover:bg-[#f1f1ff]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-[13.5px] gap-2",
  lg: "h-12 px-5.5 text-[15px] gap-2",
  icon: "h-10 w-10 p-0",
};

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className ?? "h-4 w-4"}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  loading,
  iconStart,
  iconEnd,
  children,
  className,
  ...rest
}: ButtonProps) {
  const classNames = [
    "inline-flex items-center justify-center rounded-lg font-semibold whitespace-nowrap transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
    "disabled:opacity-50 disabled:pointer-events-none",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {loading ? <Spinner /> : iconStart}
      <span className={loading ? "opacity-0" : undefined}>{children}</span>
      {!loading && iconEnd}
    </>
  );

  if (rest.as === "a") {
    const { as, href, ...anchorProps } = rest;
    void as;
    return (
      <Link href={href} className={classNames} {...anchorProps}>
        {content}
      </Link>
    );
  }

  const { as, ...buttonProps } = rest;
  void as;
  return (
    <button className={classNames} disabled={buttonProps.disabled || loading} {...buttonProps}>
      {content}
    </button>
  );
}
