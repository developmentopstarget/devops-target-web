export interface NavLink {
  label: string;
  labelFa?: string;
  href: string;
}

export const primaryNav: NavLink[] = [
  { label: "Shop", labelFa: "فروشگاه", href: "/products" },
  { label: "Laptops", labelFa: "لپ‌تاپ‌ها", href: "/categories/laptops" },
  { label: "Desktops & PCs", labelFa: "کامپیوتر و کیس", href: "/categories/desktops-pcs" },
  { label: "Components", labelFa: "قطعات", href: "/categories/components" },
  { label: "Deals", labelFa: "تخفیف‌ها", href: "/deals" },
  { label: "Support", labelFa: "پشتیبانی", href: "/support" },
];

export interface BottomNavLink {
  label: string;
  labelFa: string;
  href: string;
  icon: "home" | "shop" | "cart" | "user";
}

export const bottomNav: readonly BottomNavLink[] = [
  { label: "Home", labelFa: "خانه", href: "/", icon: "home" },
  { label: "Shop", labelFa: "فروشگاه", href: "/products", icon: "shop" },
  { label: "Cart", labelFa: "سبد خرید", href: "/cart", icon: "cart" },
  { label: "Account", labelFa: "حساب کاربری", href: "/account", icon: "user" },
] as const;

