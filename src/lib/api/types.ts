// Raw DTO shapes returned by the devops-target-api Django backend
// (backend/shop/serializers.py). Kept separate from the frontend's
// Product/ProductDetail types (src/data/products.ts, src/data/product-details.ts)
// so the mapping between the two is explicit — see src/lib/api/mappers.ts.

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  parent: string | null;
  image: string;
  order: number;
  is_active: boolean;
}

export interface ApiProductImage {
  id: number;
  url: string;
  alt: string;
  order: number;
  is_primary: boolean;
}

export interface ApiProductSpecs {
  spec?: string;
  ram_gb?: number;
  storage_gb?: number;
  [key: string]: unknown;
}

export type ApiStockStatus = "in-stock" | "low-stock" | "out-of-stock";

export interface ApiProduct {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: string;
  compare_at_price: string | null;
  stock: number;
  in_stock: boolean;
  stock_status: ApiStockStatus;
  is_featured: boolean;
  specs: ApiProductSpecs;
  aggregate_rating: number | null;
  review_count: number;
  created_at: string;
}

export interface ApiProductDetail extends ApiProduct {
  sku: string;
  description: string;
  images: ApiProductImage[];
}

export interface ApiReview {
  id: number;
  user: string;
  rating: number;
  title: string;
  body: string;
  created_at: string;
}

export interface ApiPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
