export interface NavLink {
  label: string;
  href: string;
}

export const primaryNav: NavLink[] = [
  { label: "Shop", href: "/products" },
  { label: "Laptops", href: "/categories/laptops" },
  { label: "Desktops & PCs", href: "/categories/desktops-pcs" },
  { label: "Components", href: "/categories/components" },
  { label: "Deals", href: "/deals" },
  { label: "Support", href: "/support" },
];

export const bottomNav = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Shop", href: "/products", icon: "shop" },
  { label: "Cart", href: "/cart", icon: "cart" },
  { label: "Account", href: "/account", icon: "user" },
] as const;
