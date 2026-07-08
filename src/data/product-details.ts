import { categories } from "@/data/categories";
import { formatStorage } from "@/lib/products-filter";
import { storeConfig } from "@/config/store";
import type { Product } from "@/data/products";

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string; // ISO date
  body: string;
}

export interface SpecRow {
  label: string;
  value: string;
}

export interface ProductDetail {
  sku: string;
  description: string[];
  specs: SpecRow[];
  reviews: ProductReview[];
}

// Hand-authored, mockup-accurate detail for the flagship product. Every other
// catalog product falls back to buildFallbackDetail() below — both shapes are
// placeholders for the eventual Django API detail endpoint.
const PRODUCT_DETAILS: Record<string, ProductDetail> = {
  "macbook-air-13-m3": {
    sku: "MBA13-M3-512",
    description: [
      'The MacBook Air 13" with the M3 chip delivers fanless, all-day performance for work, study, and creative projects. Its 16GB of unified memory keeps dozens of tabs, design apps, and dev tools running smoothly.',
      `Bought in-store at ${storeConfig.name} ${storeConfig.city}, every unit is checked, updated, and set up by our technicians before pickup — and backed by our local 1-year warranty.`,
    ],
    specs: [
      { label: "Chip", value: "Apple M3, 8-core CPU" },
      { label: "GPU", value: "10-core" },
      { label: "Memory", value: "16GB unified" },
      { label: "Storage", value: "512GB SSD" },
      { label: "Display", value: '13.6" Liquid Retina, 2560×1664' },
      { label: "Battery", value: "Up to 18 hours" },
      { label: "Ports", value: "2× Thunderbolt, MagSafe, 3.5mm" },
      { label: "Weight", value: "1.24 kg" },
      { label: "Warranty", value: "1 year (local, in-store)" },
    ],
    reviews: [
      {
        id: "p1-r1",
        author: "Sara L.",
        rating: 5,
        date: "2026-06-24",
        body: "Picked it up same day in Springfield. Staff set everything up and transferred my data. Fast, silent, and the battery genuinely lasts all day.",
      },
      {
        id: "p1-r2",
        author: "Marcus K.",
        rating: 5,
        date: "2026-06-08",
        body: "Great price vs. online, and having a local warranty is a huge plus. Would buy here again.",
      },
    ],
  },
};

function buildFallbackDetail(product: Product): ProductDetail {
  const categoryName = categories.find((c) => c.slug === product.category)?.name ?? "product";

  const specs: SpecRow[] = [];
  if (product.brand) specs.push({ label: "Brand", value: product.brand });
  specs.push({ label: "Category", value: categoryName });
  specs.push({ label: "Key specs", value: product.spec });
  if (product.ram !== undefined) specs.push({ label: "Memory", value: `${product.ram}GB` });
  if (product.storage !== undefined) specs.push({ label: "Storage", value: formatStorage(product.storage) });
  specs.push({ label: "Warranty", value: "1 year (local, in-store)" });

  const description = [
    `The ${product.name} is available now at ${storeConfig.name} — checked, updated, and ready for same-day pickup in ${storeConfig.city}, or free local delivery on orders over $${storeConfig.freeDeliveryThreshold}.`,
    `Every unit is set up by our in-store technicians before handover and backed by our local 1-year warranty, with 14-day returns on unopened items.`,
  ];

  // Placeholder heuristic standing in for real review data: only "popular"
  // items get sample reviews, so the empty-reviews state has real coverage.
  const reviews: ProductReview[] =
    product.reviewCount > 60
      ? [
          {
            id: `${product.id}-r1`,
            author: "Sara L.",
            rating: Math.min(5, Math.round(product.rating)),
            date: "2026-06-20",
            body: `Picked it up same day in ${storeConfig.city}. Staff were quick and helpful — exactly as described.`,
          },
          {
            id: `${product.id}-r2`,
            author: "Marcus K.",
            rating: Math.max(3, Math.round(product.rating) - 1),
            date: "2026-05-28",
            body: "Good price versus buying online, and having a local warranty is a big plus.",
          },
        ]
      : [];

  return { sku: product.id.toUpperCase(), description, specs, reviews };
}

export function getProductDetail(product: Product): ProductDetail {
  return PRODUCT_DETAILS[product.slug] ?? buildFallbackDetail(product);
}
