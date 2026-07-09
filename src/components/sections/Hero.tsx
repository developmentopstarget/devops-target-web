import { dealsOfTheWeek, featuredDealSlug } from "@/data/products";
import { fetchProductBySlug } from "@/lib/api/products";
import { HeroContent } from "@/components/sections/HeroContent";

export async function Hero() {
  const apiResult = await fetchProductBySlug(featuredDealSlug);
  const featured = apiResult?.product ?? dealsOfTheWeek.find((product) => product.slug === featuredDealSlug);

  return <HeroContent featured={featured} />;
}
