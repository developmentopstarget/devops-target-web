export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";
export type ProductBadge = "sale" | "new";

export interface Product {
  id: string;
  slug: string;
  name: string;
  spec: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  stock: StockStatus;
  badge?: ProductBadge;
}

// Realistic placeholder data — swap for the Django API response at build/revalidate.
export const dealsOfTheWeek: Product[] = [
  {
    id: "p1",
    slug: "macbook-air-13-m3",
    name: 'MacBook Air 13" M3',
    spec: "8-core · 16GB · 512GB",
    category: "laptops",
    price: 1199,
    compareAtPrice: 1299,
    rating: 4.8,
    reviewCount: 126,
    stock: "in-stock",
    badge: "sale",
  },
  {
    id: "p2",
    slug: "asus-rog-strix-g16",
    name: "ASUS ROG Strix G16",
    spec: "RTX 4060 · i7 · 16GB",
    category: "laptops",
    price: 1349,
    rating: 4.7,
    reviewCount: 84,
    stock: "low-stock",
    badge: "new",
  },
  {
    id: "p3",
    slug: "nvidia-rtx-4070-ti",
    name: "NVIDIA RTX 4070 Ti",
    spec: "12GB GDDR6X · triple fan",
    category: "components",
    price: 799,
    compareAtPrice: 869,
    rating: 4.9,
    reviewCount: 203,
    stock: "in-stock",
    badge: "sale",
  },
  {
    id: "p4",
    slug: "dell-ultrasharp-27-4k",
    name: 'Dell UltraSharp 27" 4K',
    spec: "IPS · USB-C · 60Hz",
    category: "monitors",
    price: 549,
    rating: 4.6,
    reviewCount: 57,
    stock: "out-of-stock",
  },
  {
    id: "p5",
    slug: "aurora-ryzen-7-gaming-pc",
    name: "Aurora Ryzen 7 Gaming PC",
    spec: "RTX 4070 · 32GB · 1TB",
    category: "desktops-pcs",
    price: 1499,
    compareAtPrice: 1699,
    rating: 4.8,
    reviewCount: 41,
    stock: "low-stock",
    badge: "sale",
  },
  {
    id: "p6",
    slug: "samsung-990-pro-2tb",
    name: "Samsung 990 Pro 2TB NVMe",
    spec: "PCIe 4.0 · 7450MB/s",
    category: "components",
    price: 169,
    compareAtPrice: 199,
    rating: 4.9,
    reviewCount: 312,
    stock: "in-stock",
    badge: "sale",
  },
  {
    id: "p7",
    slug: "logitech-mx-keys-s-combo",
    name: "Logitech MX Keys S Combo",
    spec: "Keyboard + MX Master 3S",
    category: "peripherals",
    price: 199,
    rating: 4.7,
    reviewCount: 98,
    stock: "in-stock",
  },
  {
    id: "p8",
    slug: "corsair-vengeance-32gb-ddr5",
    name: "Corsair Vengeance 32GB DDR5",
    spec: "6000MHz · CL30 · RGB",
    category: "components",
    price: 114,
    compareAtPrice: 139,
    rating: 4.8,
    reviewCount: 176,
    stock: "in-stock",
    badge: "sale",
  },
];

export const featuredDealSlug = "aurora-ryzen-7-gaming-pc";

export function getProductBySlug(slug: string): Product | undefined {
  return dealsOfTheWeek.find((product) => product.slug === slug);
}
