"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartIcon, HomeIcon, ShopIcon, UserIcon } from "@/components/ui/icons";
import { bottomNav } from "@/config/nav";

const icons = {
  home: HomeIcon,
  shop: ShopIcon,
  cart: CartIcon,
  user: UserIcon,
} as const;

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile"
      className="sticky bottom-0 z-40 flex justify-around border-t border-border bg-surface px-1 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 lg:hidden"
    >
      {bottomNav.map((item) => {
        const Icon = icons[item.icon];
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={[
              "flex flex-1 flex-col items-center gap-0.5 text-[10.5px] font-semibold",
              active ? "text-accent" : "text-tertiary",
            ].join(" ")}
          >
            <Icon className="h-[21px] w-[21px]" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
