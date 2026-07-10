"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartIcon, HomeIcon, ShopIcon, UserIcon } from "@/components/ui/icons";
import { useLanguage, TranslationKey } from "@/lib/useLanguage";

const icons = {
  home: HomeIcon,
  shop: ShopIcon,
  cart: CartIcon,
  profile: UserIcon,
} as const;

interface MobileTab {
  labelKey: TranslationKey;
  href: string;
  icon: keyof typeof icons;
}

const mobileTabs: readonly MobileTab[] = [
  { labelKey: "home", href: "/", icon: "home" },
  { labelKey: "shop", href: "/products", icon: "shop" },
  { labelKey: "cart", href: "/cart", icon: "cart" },
  { labelKey: "profile", href: "/account", icon: "profile" },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav
      aria-label="Mobile"
      dir="ltr"
      className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-surface border-t flex justify-around items-center px-4 max-w-full lg:hidden"
    >
      {mobileTabs.map((item) => {
        const Icon = icons[item.icon];
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const label = t(item.labelKey);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={[
              "flex flex-1 flex-col items-center gap-0.5 text-[12px] font-semibold transition-colors",
              active ? "text-accent" : "text-tertiary hover:text-primary",
            ].join(" ")}
          >
            <Icon className="h-[21px] w-[21px]" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
