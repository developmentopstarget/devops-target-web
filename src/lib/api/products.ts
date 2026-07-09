import { API_BASE_URL } from "@/lib/auth/config";
import type { Product } from "@/data/products";
import type { ProductDetail } from "@/data/product-details";
import { PAGE_SIZE, filtersToQueryString, type PaginatedResult, type ParsedFilters } from "@/lib/products-filter";
import { mapApiProduct, mapApiProductDetail } from "@/lib/api/mappers";
import type { ApiPaginatedResponse, ApiProduct, ApiProductDetail, ApiReview } from "@/lib/api/types";

const REVALIDATE_SECONDS = 3600;

// Hard cap on pagination follow-through (generateStaticParams) so a
// misbehaving API can't send this into an unbounded loop at build time.
const MAX_SLUG_PAGES = 200;

function isApiConfigured(): boolean {
  return API_BASE_URL.length > 0;
}

export async function fetchProducts(filters: ParsedFilters): Promise<PaginatedResult<Product> | null> {
  if (!isApiConfigured()) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${filtersToQueryString(filters)}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as ApiPaginatedResponse<ApiProduct>;
    return {
      items: data.results.map(mapApiProduct),
      page: filters.page,
      pageCount: Math.max(1, Math.ceil(data.count / PAGE_SIZE)),
      total: data.count,
    };
  } catch {
    return null;
  }
}

export async function fetchProductBySlug(slug: string): Promise<{ product: Product; detail: ProductDetail } | null> {
  if (!isApiConfigured()) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${slug}/`, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return null;
    const apiProduct = (await res.json()) as ApiProductDetail;

    const reviewsRes = await fetch(`${API_BASE_URL}/api/products/${slug}/reviews/`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    const apiReviews = reviewsRes.ok ? ((await reviewsRes.json()) as ApiReview[]) : [];

    return {
      product: mapApiProduct(apiProduct),
      detail: mapApiProductDetail(apiProduct, apiReviews),
    };
  } catch {
    return null;
  }
}

// Walks every page via DRF's `next` cursor to collect all slugs for
// generateStaticParams. Only used at build time.
export async function fetchAllProductSlugs(): Promise<string[] | null> {
  if (!isApiConfigured()) return null;
  try {
    const slugs: string[] = [];
    let url: string | null = `${API_BASE_URL}/api/products/`;
    let pagesFetched = 0;

    while (url && pagesFetched < MAX_SLUG_PAGES) {
      const res: Response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
      if (!res.ok) return slugs.length > 0 ? slugs : null;
      const data = (await res.json()) as ApiPaginatedResponse<ApiProduct>;
      slugs.push(...data.results.map((p) => p.slug));
      url = data.next;
      pagesFetched += 1;
    }

    return slugs;
  } catch {
    return null;
  }
}
