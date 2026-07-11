import Link from "next/link";
import Image from "next/image";
import { ShieldCheckIcon } from "@/components/ui/icons";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Container } from "@/components/layout/Container";
import { useLanguage } from "@/lib/useLanguage";

export function CheckoutHeader() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface">
      <Container className="flex h-15 items-center justify-between">
        <Link
          href="/"
          className="flex shrink-0 items-center"
        >
          <Image
            src="/assets/images/niavaran-computer-logo.png"
            alt="Niavaran Computer Logo"
            width={160}
            height={32}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>
        <span className="hidden items-center gap-1.75 text-[12.5px] font-semibold text-secondary sm:flex">
          <ShieldCheckIcon className="h-[15px] w-[15px] text-success" aria-hidden="true" />
          {t("secureCheckout")}
        </span>
        <ThemeToggle />
      </Container>
    </header>
  );
}
