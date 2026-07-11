"use client";

import Link from "next/link";
import Image from "next/image";
import { storeConfig } from "@/config/store";
import { Container } from "@/components/layout/Container";
import { useLanguage, TranslationKey } from "@/lib/useLanguage";

interface FooterLink {
  labelKey: "laptops" | "desktopsAndPCs" | "components" | "monitors" | "deals" | "contactUs" | "buildService" | "warranty" | "trackOrder" | "faq" | "about" | "visitStore" | "careers" | "blog";
  href?: string;
}

function FooterColumn({ title, links, t }: { title: string; links: FooterLink[]; t: (key: TranslationKey) => string }) {
  return (
    <div>
      <h4 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-tertiary">{title}</h4>
      <ul className="flex flex-col">
        {links.map((link) => (
          <li key={link.labelKey}>
            {link.href ? (
              <Link href={link.href} className="block py-1.5 text-[13px] text-secondary hover:text-primary">
                {t(link.labelKey)}
              </Link>
            ) : (
              <span className="block py-1.5 text-[13px] text-tertiary">{t(link.labelKey)}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const { t, isRtl } = useLanguage();

  const shopLinks: FooterLink[] = [
    { labelKey: "laptops", href: "/categories/laptops" },
    { labelKey: "desktopsAndPCs", href: "/categories/desktops-pcs" },
    { labelKey: "components", href: "/categories/components" },
    { labelKey: "monitors", href: "/categories/monitors" },
    { labelKey: "deals", href: "/deals" },
  ];

  const supportLinks: FooterLink[] = [
    { labelKey: "contactUs", href: "/contact" },
    { labelKey: "buildService", href: "#build-a-pc" },
    { labelKey: "warranty" },
    { labelKey: "trackOrder" },
    { labelKey: "faq", href: "/faq" },
  ];

  const companyLinks: FooterLink[] = [
    { labelKey: "about", href: "/about" },
    { labelKey: "visitStore", href: "#store-local" },
    { labelKey: "careers" },
    { labelKey: "blog", href: "/blog" },
  ];

  return (
    <footer className="mt-2 border-t border-border bg-surface">
      <Container>
        <div className="grid grid-cols-2 gap-y-6 gap-x-4 py-9 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex shrink-0 items-center">
              <Image
                src="/assets/images/niavaran-computer-logo.png"
                alt="Niavaran Computer Logo"
                width={160}
                height={32}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="mt-3 max-w-[30ch] text-[12.5px] leading-relaxed text-secondary">
              {t("footerDescription")}
            </p>
          </div>
          <FooterColumn title={t("footerShopTitle")} links={shopLinks} t={t} />
          <FooterColumn title={t("footerSupportTitle")} links={supportLinks} t={t} />
          <FooterColumn title={t("footerCompanyTitle")} links={companyLinks} t={t} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border py-4 text-xs text-tertiary">
          <span>
            © {new Date().getFullYear()} {isRtl ? "دیوپس تارگت" : storeConfig.name} (NIAVARAN) · {isRtl ? storeConfig.cityFa : storeConfig.city}
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
