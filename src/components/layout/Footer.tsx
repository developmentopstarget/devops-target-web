import Link from "next/link";
import { LogoMarkIcon } from "@/components/ui/icons";
import { storeConfig } from "@/config/store";
import { Container } from "@/components/layout/Container";

interface FooterLink {
  label: string;
  href?: string;
}

const shopLinks: FooterLink[] = [
  { label: "Laptops", href: "/categories/laptops" },
  { label: "Desktops & PCs", href: "/categories/desktops-pcs" },
  { label: "Components", href: "/categories/components" },
  { label: "Monitors", href: "/categories/monitors" },
  { label: "Deals", href: "/deals" },
];

const supportLinks: FooterLink[] = [
  { label: "Contact us", href: "/contact" },
  { label: "Build service", href: "#build-a-pc" },
  { label: "Warranty" },
  { label: "Track order" },
  { label: "FAQ", href: "/faq" },
];

const companyLinks: FooterLink[] = [
  { label: "About", href: "/about" },
  { label: "Visit store", href: "#store-local" },
  { label: "Careers" },
  { label: "Blog", href: "/blog" },
];

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h4 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-tertiary">{title}</h4>
      <ul className="flex flex-col">
        {links.map((link) => (
          <li key={link.label}>
            {link.href ? (
              <Link href={link.href} className="block py-1.5 text-[13px] text-secondary hover:text-primary">
                {link.label}
              </Link>
            ) : (
              <span className="block py-1.5 text-[13px] text-tertiary">{link.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-2 border-t border-border bg-surface">
      <Container>
        <div className="grid grid-cols-2 gap-y-6 gap-x-4 py-9 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 text-[16px] font-extrabold tracking-tight text-primary">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-gradient-to-br from-accent to-accent-hover text-white">
                <LogoMarkIcon className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              DevOps<span className="text-accent">Target</span>
            </Link>
            <p className="mt-3 max-w-[30ch] text-[12.5px] leading-relaxed text-secondary">
              {storeConfig.city}&rsquo;s trusted computer store — laptops, custom PCs, components,
              and expert local service.
            </p>
          </div>
          <FooterColumn title="Shop" links={shopLinks} />
          <FooterColumn title="Support" links={supportLinks} />
          <FooterColumn title="Company" links={companyLinks} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border py-4 text-xs text-tertiary">
          <span>
            © {new Date().getFullYear()} {storeConfig.name} · {storeConfig.city}
          </span>
          <div className="flex gap-1.5">
            {["VISA", "MC", "AMEX", "PAY"].map((mark) => (
              <span
                key={mark}
                className="flex h-[22px] w-[34px] items-center justify-center rounded-[5px] border border-border bg-surface-2 text-[8px] font-bold text-secondary"
              >
                {mark}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
