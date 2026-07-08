export interface Category {
  slug: string;
  name: string;
  count: string;
  icon: "laptop" | "desktop" | "components" | "monitor" | "peripherals" | "network";
}

export const categories: Category[] = [
  { slug: "laptops", name: "Laptops", count: "240+ in stock", icon: "laptop" },
  { slug: "desktops-pcs", name: "Desktops & PCs", count: "120+ builds", icon: "desktop" },
  { slug: "components", name: "Components", count: "GPU · CPU · RAM", icon: "components" },
  { slug: "monitors", name: "Monitors", count: "90+ models", icon: "monitor" },
  { slug: "peripherals", name: "Peripherals", count: "Keys · mice · audio", icon: "peripherals" },
  { slug: "networking", name: "Networking", count: "Routers & more", icon: "network" },
];
