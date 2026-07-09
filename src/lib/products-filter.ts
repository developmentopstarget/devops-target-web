import type { Product } from "@/data/products";

export type SortValue = "relevance" | "price_asc" | "price_desc" | "newest" | "rating";

export const sortOptions: { value: SortValue; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Top rated" },
];

const SORT_VALUES = sortOptions.map((o) => o.value);

export const PAGE_SIZE = 12;

export interface ParsedFilters {
  category: string[];
  brand: string[];
  ram: number[];
  storage: number[];
  priceMin?: number;
  priceMax?: number;
  minRating?: number;
  inStockOnly: boolean;
  sort: SortValue;
  page: number;
}

export const emptyFilters: ParsedFilters = {
  category: [],
  brand: [],
  ram: [],
  storage: [],
  inStockOnly: false,
  sort: "relevance",
  page: 1,
};

export type RawSearchParams = { [key: string]: string | string[] | undefined };

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function toArray(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function toNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export function parseFilters(searchParams: RawSearchParams): ParsedFilters {
  const sortRaw = first(searchParams.sort);
  const sort = (SORT_VALUES as string[]).includes(sortRaw ?? "") ? (sortRaw as SortValue) : "relevance";
  const page = Math.max(1, Number(first(searchParams.page)) || 1);

  return {
    category: toArray(searchParams.category),
    brand: toArray(searchParams.brand),
    ram: toArray(searchParams.ram).map(Number).filter(Number.isFinite),
    storage: toArray(searchParams.storage).map(Number).filter(Number.isFinite),
    priceMin: toNumber(first(searchParams.priceMin)),
    priceMax: toNumber(first(searchParams.priceMax)),
    minRating: toNumber(first(searchParams.minRating)),
    inStockOnly: first(searchParams.inStock) === "1",
    sort,
    page,
  };
}

export function countActiveDimensions(filters: ParsedFilters): number {
  return [
    filters.category.length > 0,
    filters.brand.length > 0,
    filters.ram.length > 0,
    filters.storage.length > 0,
    filters.priceMin !== undefined || filters.priceMax !== undefined,
    filters.minRating !== undefined,
    filters.inStockOnly,
  ].filter(Boolean).length;
}

export function filterProducts(products: Product[], filters: ParsedFilters): Product[] {
  return products.filter((p) => {
    if (filters.category.length && !filters.category.includes(p.category)) return false;
    if (filters.brand.length && !(p.brand && filters.brand.includes(p.brand))) return false;
    if (filters.ram.length && !(p.ram !== undefined && filters.ram.includes(p.ram))) return false;
    if (filters.storage.length && !(p.storage !== undefined && filters.storage.includes(p.storage))) return false;
    if (filters.priceMin !== undefined && p.price < filters.priceMin) return false;
    if (filters.priceMax !== undefined && p.price > filters.priceMax) return false;
    if (filters.minRating !== undefined && p.rating < filters.minRating) return false;
    if (filters.inStockOnly && p.stock === "out-of-stock") return false;
    return true;
  });
}

export function sortProducts(products: Product[], sort: SortValue): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "price_asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      sorted.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
      break;
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }
  return sorted;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageCount: number;
  total: number;
}

export function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResult<T> {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), page: safePage, pageCount, total: items.length };
}

export function formatStorage(gb: number): string {
  return gb >= 1024 ? `${gb / 1024}TB` : `${gb}GB`;
}

export function toggleArrayValue<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

const CLEARED_FILTERS: Partial<ParsedFilters> = {
  category: [],
  brand: [],
  ram: [],
  storage: [],
  priceMin: undefined,
  priceMax: undefined,
  minRating: undefined,
  inStockOnly: false,
};

export function clearedFilterPatch(): Partial<ParsedFilters> {
  return CLEARED_FILTERS;
}

export function filtersToQueryString(filters: ParsedFilters): string {
  const params = new URLSearchParams();
  filters.category.forEach((c) => params.append("category", c));
  filters.brand.forEach((b) => params.append("brand", b));
  filters.ram.forEach((r) => params.append("ram", String(r)));
  filters.storage.forEach((s) => params.append("storage", String(s)));
  if (filters.priceMin !== undefined) params.set("priceMin", String(filters.priceMin));
  if (filters.priceMax !== undefined) params.set("priceMax", String(filters.priceMax));
  if (filters.minRating !== undefined) params.set("minRating", String(filters.minRating));
  if (filters.inStockOnly) params.set("inStock", "1");
  if (filters.sort !== "relevance") params.set("sort", filters.sort);
  if (filters.page > 1) params.set("page", String(filters.page));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Builds a href for `pathname` applying `patch` on top of the current `filters`.
 * Any filter change resets pagination back to page 1 unless `resetPage` is
 * explicitly set to false (used by Pagination links, which set `page` directly).
 */
export function hrefWithPatch(
  pathname: string,
  filters: ParsedFilters,
  patch: Partial<ParsedFilters> & { resetPage?: boolean },
): string {
  const { resetPage = true, ...rest } = patch;
  const next: ParsedFilters = { ...filters, ...rest };
  if (resetPage) next.page = 1;
  return pathname + filtersToQueryString(next);
}
