import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { DealsSection } from "@/components/sections/DealsSection";
import { storeConfig } from "@/config/store";
import { dealsOfTheWeek } from "@/data/products";
import { fetchProducts } from "@/lib/api/products";
import { emptyFilters } from "@/lib/products-filter";

// Django's default ordering (`-is_featured, -created_at, -id`) surfaces
// featured products first, so page 1 with no filters approximates "deals of
// the week" without needing a dedicated deals endpoint.
const DEALS_COUNT = 8;

export async function Deals() {
  const apiResult = await fetchProducts(emptyFilters);
  const products = apiResult ? apiResult.items.slice(0, DEALS_COUNT) : dealsOfTheWeek;

  return (
    <section className="bg-surface-2 py-10 lg:py-14">
      <Container>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-primary sm:text-xl">
              This week&rsquo;s deals
            </h2>
            <p className="mt-0.75 text-[13.5px] text-secondary">
              Handpicked by our {storeConfig.city} store team.
            </p>
          </div>
          <Link
            href="/deals"
            className="whitespace-nowrap text-[13px] font-semibold text-accent hover:text-accent-hover"
          >
            See all deals →
          </Link>
        </div>
        <DealsSection products={products} />
      </Container>
    </section>
  );
}
