import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { iconButtonClassName } from "@/components/ui/IconButton";
import { LogoMarkIcon, UserIcon } from "@/components/ui/icons";
import { primaryNav } from "@/config/nav";
import { Container } from "@/components/layout/Container";
import { SearchBar } from "@/components/layout/SearchBar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { CartButton } from "@/components/layout/CartButton";
import { MobileDrawer } from "@/components/layout/MobileDrawer";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface">
      <Container className="flex h-15 items-center gap-4">
        <MobileDrawer />
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 text-[16px] font-extrabold tracking-tight text-primary"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-gradient-to-br from-accent to-accent-hover text-white">
            <LogoMarkIcon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          DevOps<span className="text-accent">Target</span>
        </Link>
        <nav className="ms-2 hidden items-center gap-1 lg:flex" aria-label="Primary">
          {primaryNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-[13.5px] font-semibold text-secondary hover:bg-surface-2 hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <SearchBar className="hidden max-w-[420px] flex-1 lg:block" />
        <div className="ms-auto flex items-center gap-1.5">
          <ThemeToggle />
          <Link href="/login" aria-label="Account" className={iconButtonClassName()}>
            <UserIcon className="h-[19px] w-[19px]" aria-hidden="true" />
          </Link>
          <CartButton />
          <Button as="a" href="/products" className="hidden lg:inline-flex">
            Shop now
          </Button>
        </div>
      </Container>
    </header>
  );
}
