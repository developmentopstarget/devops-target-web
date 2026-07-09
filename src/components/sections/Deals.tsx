import { Container } from "@/components/layout/Container";
import { DealsSection } from "@/components/sections/DealsSection";
import { DealsHeader } from "@/components/sections/DealsHeader";
import { dealsOfTheWeek } from "@/data/products";
import { fetchProducts } from "@/lib/api/products";
import { emptyFilters } from "@/lib/products-filter";

const DEALS_COUNT = 8;

export async function Deals() {
  const apiResult = await fetchProducts(emptyFilters);
  const products = apiResult ? apiResult.items.slice(0, DEALS_COUNT) : dealsOfTheWeek;

  return (
    <section className="bg-surface-2 py-10 lg:py-14">
      <Container>
        <DealsHeader />
        <DealsSection products={products} />
      </Container>
    </section>
  );
}
