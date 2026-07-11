import type { Product, ProductBadge } from "@/data/products";
import type { ProductDetail, ProductReview, SpecRow } from "@/data/product-details";
import type { ApiProduct, ApiProductDetail, ApiReview } from "@/lib/api/types";

// Django doesn't send a "badge" field — derive the same sale/new presentation
// the placeholder catalog hand-authored, from fields the API does send.
function deriveBadge(api: ApiProduct, price: number, compareAtPrice: number | undefined): ProductBadge | undefined {
  if (compareAtPrice !== undefined && compareAtPrice > price) return "sale";
  const createdAt = new Date(api.created_at).getTime();
  const daysSinceCreated = Number.isFinite(createdAt) ? (Date.now() - createdAt) / 86_400_000 : Infinity;
  if (daysSinceCreated <= 30) return "new";
  return undefined;
}

export function mapApiProduct(api: ApiProduct): Product {
  const price = Number(api.price);
  const compareAtPrice = api.compare_at_price !== null ? Number(api.compare_at_price) : undefined;

  return {
    id: String(api.id),
    slug: api.slug,
    name: api.name,
    spec: typeof api.specs.spec === "string" ? api.specs.spec : "",
    category: api.category,
    brand: api.brand || undefined,
    ram: typeof api.specs.ram_gb === "number" ? api.specs.ram_gb : undefined,
    storage: typeof api.specs.storage_gb === "number" ? api.specs.storage_gb : undefined,
    price,
    compareAtPrice,
    rating: api.aggregate_rating ?? 0,
    reviewCount: api.review_count,
    stock: api.stock_status,
    badge: deriveBadge(api, price, compareAtPrice),
    createdAt: api.created_at,
    pricing_mode: api.pricing_mode,
  };
}

function humanizeSpecKey(key: string): string {
  const withUnit = key.endsWith("_gb") ? `${key.slice(0, -3)} (GB)` : key;
  return withUnit.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function mapReview(api: ApiReview): ProductReview {
  return {
    id: String(api.id),
    author: api.user,
    rating: api.rating,
    date: api.created_at,
    body: api.title ? `${api.title}\n\n${api.body}` : api.body,
  };
}

export function mapApiProductDetail(api: ApiProductDetail, apiReviews: ApiReview[]): ProductDetail {
  const specs: SpecRow[] = [];
  if (api.brand) specs.push({ label: "Brand", value: api.brand });
  Object.entries(api.specs).forEach(([key, value]) => {
    if (key === "spec" || value === null || value === undefined || value === "") return;
    specs.push({ label: humanizeSpecKey(key), value: String(value) });
  });
  specs.push({ label: "SKU", value: api.sku });

  return {
    sku: api.sku,
    description: api.description ? api.description.split(/\n{2,}/).filter(Boolean) : [],
    specs,
    reviews: apiReviews.map(mapReview),
  };
}
