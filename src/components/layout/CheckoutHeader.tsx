import Link from "next/link";
import { LogoMarkIcon, ShieldCheckIcon } from "@/components/ui/icons";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Container } from "@/components/layout/Container";

export function CheckoutHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface">
      <Container className="flex h-15 items-center justify-between">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 text-[16px] font-extrabold tracking-tight text-primary"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-gradient-to-br from-accent to-accent-hover text-white">
            <LogoMarkIcon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          DevOps<span className="text-accent">Target</span>
        </Link>
        <span className="hidden items-center gap-1.75 text-[12.5px] font-semibold text-secondary sm:flex">
          <ShieldCheckIcon className="h-[15px] w-[15px] text-success" aria-hidden="true" />
          Secure checkout
        </span>
        <ThemeToggle />
      </Container>
    </header>
  );
}
