import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Pagination } from "@/components/ui/Pagination";
import { ProductGrid } from "@/components/commerce/ProductGrid";
import { FilterPanel } from "@/components/commerce/FilterPanel";
import { FilterDrawer } from "@/components/commerce/FilterDrawer";
import { SortDropdown } from "@/components/commerce/SortDropdown";
import { ActiveFilterChips } from "@/components/commerce/ActiveFilterChips";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { categories } from "@/data/categories";
import { catalog } from "@/data/products";
import { storeConfig } from "@/config/store";
import {
  PAGE_SIZE,
  countActiveDimensions,
  filterProducts,
  paginate,
  parseFilters,
  sortProducts,
  type RawSearchParams,
} from "@/lib/products-filter";

const PATHNAME = "/products";

interface ProductsPageProps {
  searchParams: Promise<RawSearchParams>;
}

function buildCatalogFacets() {
  const categoryOptions = categories
    .map((c) => ({ slug: c.slug, name: c.name, count: catalog.filter((p) => p.category === c.slug).length }))
    .filter((c) => c.count > 0);

  const brandCounts = new Map<string, number>();
  catalog.forEach((p) => {
    if (p.brand) brandCounts.set(p.brand, (brandCounts.get(p.brand) ?? 0) + 1);
  });
  const brandOptions = [...brandCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  const ramOptions = [...new Set(catalog.map((p) => p.ram).filter((v): v is number => v !== undefined))].sort(
    (a, b) => a - b,
  );
  const storageOptions = [...new Set(catalog.map((p) => p.storage).filter((v): v is number => v !== undefined))].sort(
    (a, b) => a - b,
  );

  return { categoryOptions, brandOptions, ramOptions, storageOptions };
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const filters = parseFilters(await searchParams);
  const singleCategory =
    filters.category.length === 1 ? categories.find((c) => c.slug === filters.category[0]) : undefined;

  const title = singleCategory ? singleCategory.name : "All products";
  const description = singleCategory
    ? `Shop ${singleCategory.name.toLowerCase()} at ${storeConfig.name} — ${storeConfig.city}'s local computer store. Same-day pickup, free local delivery, and expert service.`
    : `Browse the full ${storeConfig.name} catalog — laptops, PCs, and components, with same-day pickup and free local delivery in ${storeConfig.city}.`;

  const canonical = singleCategory ? `${PATHNAME}?category=${singleCategory.slug}` : PATHNAME;
  const isDeepFilterView = countActiveDimensions(filters) > 1;

  return {
    title,
    description,
    alternates: { canonical },
    robots: isDeepFilterView ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const filters = parseFilters(await searchParams);
  const singleCategory =
    filters.category.length === 1 ? categories.find((c) => c.slug === filters.category[0]) : undefined;

  const { categoryOptions, brandOptions, ramOptions, storageOptions } = buildCatalogFacets();
  const categoryLabels = Object.fromEntries(categories.map((c) => [c.slug, c.name]));

  const filtered = filterProducts(catalog, filters);
  const sorted = sortProducts(filtered, filters.sort);
  const { items, page, pageCount, total } = paginate(sorted, filters.page, PAGE_SIZE);

  const title = singleCategory ? singleCategory.name : "All products";
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: singleCategory ? "/products" : undefined },
    ...(singleCategory ? [{ label: singleCategory.name }] : []),
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Container>
          <Breadcrumbs items={breadcrumbItems} />

          <div className="flex flex-wrap items-end justify-between gap-4 pb-4.5 pt-1.5">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-primary">{title}</h1>
              <p className="mt-1 text-[13px] text-secondary">
                <span className="font-mono font-semibold text-primary">{total}</span> products · in{" "}
                {storeConfig.city} &amp; online
              </p>
            </div>
          </div>

          <div className="pb-3.5 lg:hidden">
            <FilterDrawer
              pathname={PATHNAME}
              filters={filters}
              categoryOptions={categoryOptions}
              brandOptions={brandOptions}
              ramOptions={ramOptions}
              storageOptions={storageOptions}
              resultCount={total}
            />
          </div>

          <div className="grid gap-6 pb-12 lg:grid-cols-[264px_1fr] lg:items-start">
            <aside className="hidden lg:sticky lg:top-19 lg:block">
              <FilterPanel
                pathname={PATHNAME}
                filters={filters}
                categoryOptions={categoryOptions}
                brandOptions={brandOptions}
                ramOptions={ramOptions}
                storageOptions={storageOptions}
              />
            </aside>

            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <ActiveFilterChips pathname={PATHNAME} filters={filters} categoryLabels={categoryLabels} />
                <SortDropdown pathname={PATHNAME} filters={filters} />
              </div>

              <ProductGrid
                products={items}
                gridColsClassName="grid grid-cols-2 gap-3.5 sm:grid-cols-3 xl:grid-cols-4"
                emptyTitle="No products match these filters"
                emptyDescription="Try removing a filter or two to see more results."
                emptyAction={
                  <Button as="a" href={PATHNAME} variant="secondary" size="sm">
                    Clear all filters
                  </Button>
                }
              />

              <Pagination pathname={PATHNAME} filters={filters} page={page} pageCount={pageCount} />
            </div>
          </div>
        </Container>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
