import { API_BASE_URL } from "@/lib/auth/config";
import type { ApiCategory } from "@/lib/api/types";

const REVALIDATE_SECONDS = 3600;

export interface ApiCategorySummary {
  slug: string;
  name: string;
}

// CategoryViewSet has no pagination_class, so this returns a plain array,
// unlike GET /api/products/ (see fetchProducts in src/lib/api/products.ts).
export async function fetchCategories(): Promise<ApiCategorySummary[] | null> {
  if (!API_BASE_URL) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/api/categories/`, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return null;
    const data = (await res.json()) as ApiCategory[];
    return data.map((c) => ({ slug: c.slug, name: c.name }));
  } catch {
    return null;
  }
}
