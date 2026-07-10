import Link from "next/link";
import type { ReactNode } from "react";
import { LogoMarkIcon } from "@/components/ui/icons";
import { useLanguage } from "@/lib/useLanguage";
import { iconButtonClassName } from "@/components/ui/IconButton";

export interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  const { isRtl } = useLanguage();

  const handleToggleDirection = () => {
    if (typeof window !== "undefined") {
      const nextDir = isRtl ? "ltr" : "rtl";
      document.documentElement.dir = nextDir;
      document.documentElement.lang = nextDir === "rtl" ? "fa" : "en";
      window.dispatchEvent(new Event("languagechange"));
    }
  };

  return (
    <div className="relative w-full max-w-[420px] rounded-2xl border border-border bg-surface p-6 shadow-md sm:p-7">
      <div className="absolute top-3.5 right-3.5 z-10">
        <button
          onClick={handleToggleDirection}
          className={iconButtonClassName()}
          title={isRtl ? "Switch to English" : "تغییر به فارسی"}
          aria-label="Toggle language"
        >
          <span className="text-[12px] font-bold tracking-tight">
            {isRtl ? "EN" : "فا"}
          </span>
        </button>
      </div>

      <Link
        href="/"
        className="mb-4.5 flex items-center justify-center gap-2.5 text-[16px] font-extrabold tracking-tight text-primary"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-gradient-to-br from-accent to-accent-hover text-white">
          <LogoMarkIcon className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
        DevOps<span className="text-accent">Target</span>
      </Link>

      <h1 className="text-center text-xl font-extrabold tracking-tight text-primary">{title}</h1>
      {subtitle && <p className="mt-1.5 text-center text-[13px] text-secondary">{subtitle}</p>}

      <div className="mt-5">{children}</div>

      {footer && <div className="mt-4 text-center text-[13px] text-secondary">{footer}</div>}
    </div>
  );
}
