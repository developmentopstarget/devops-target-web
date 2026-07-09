import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductGrid } from "@/components/commerce/ProductGrid";
import { ProductGallery } from "@/components/commerce/ProductGallery";
import { BuyBox } from "@/components/commerce/BuyBox";
import { SpecTable } from "@/components/commerce/SpecTable";
import { ProductTabs } from "@/components/commerce/ProductTabs";
import { ReviewSummary } from "@/components/commerce/ReviewSummary";
import { ReviewList } from "@/components/commerce/ReviewList";
import { StickyBuyBar } from "@/components/commerce/StickyBuyBar";
import { RelatedProductsHeading } from "@/components/commerce/RelatedProductsHeading";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { ProductJsonLd } from "@/components/seo/ProductJsonLd";
import { categories } from "@/data/categories";
import { catalog, getProductBySlug, type Product } from "@/data/products";
import { getProductDetail, type ProductDetail } from "@/data/product-details";
import { storeConfig } from "@/config/store";
import { fetchCategories } from "@/lib/api/categories";
import { fetchAllProductSlugs, fetchProductBySlug, fetchProducts } from "@/lib/api/products";
import { emptyFilters } from "@/lib/products-filter";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await fetchAllProductSlugs();
  if (slugs && slugs.length > 0) return slugs.map((slug) => ({ slug }));
  return catalog.map((product) => ({ slug: product.slug }));
}

async function resolveProduct(slug: string): Promise<{ product: Product; detail: ProductDetail } | null> {
  const apiResult = await fetchProductBySlug(slug);
  if (apiResult) return apiResult;

  const product = getProductBySlug(slug);
  if (!product) return null;
  return { product, detail: getProductDetail(product) };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await resolveProduct(slug);
  if (!resolved) return {};

  const { product, detail } = resolved;
  const description = detail.description[0];

  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: { title: product.name, description },
  };
}

async function getRelatedProducts(product: Product): Promise<Product[]> {
  const apiResult = await fetchProducts({ ...emptyFilters, category: [product.category] });
  if (apiResult) return apiResult.items.filter((p) => p.slug !== product.slug).slice(0, 4);

  const sameCategory = catalog.filter((p) => p.category === product.category && p.slug !== product.slug);
  const rest = catalog.filter((p) => p.category !== product.category && p.slug !== product.slug);
  return [...sameCategory, ...rest].slice(0, 4);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const resolved = await resolveProduct(slug);
  if (!resolved) notFound();

  const { product, detail } = resolved;
  const categoryList = (await fetchCategories()) ?? categories;
  const categoryName = categoryList.find((c) => c.slug === product.category)?.name;
  const related = await getRelatedProducts(product);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/products" },
    ...(categoryName ? [{ label: categoryName, href: `/products?category=${product.category}` }] : []),
    { label: product.name },
  ];

  const tabs = [
    { id: "specs", label: "Specs", content: <SpecTable specs={detail.specs} /> },
    {
      id: "overview",
      label: "Overview",
      content: (
        <div className="max-w-[70ch]">
          {detail.description.map((paragraph, i) => (
            <p key={i} className="mb-3 text-sm text-secondary last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      ),
    },
    {
      id: "reviews",
      label: `Reviews (${product.reviewCount})`,
      content: (
        <div id="reviews">
          <ReviewSummary rating={product.rating} reviewCount={product.reviewCount} />
          <ReviewList reviews={detail.reviews} />
        </div>
      ),
    },
    {
      id: "shipping",
      label: "Shipping & returns",
      content: (
        <div className="max-w-[70ch] text-sm text-secondary">
          <p className="mb-3">
            <b className="font-semibold text-primary">Pickup:</b> Same-day in-store pickup in {storeConfig.city} when
            in stock. You&rsquo;ll get a notification when it&rsquo;s ready.
          </p>
          <p className="mb-3">
            <b className="font-semibold text-primary">Delivery:</b> Free local delivery on orders over $
            {storeConfig.freeDeliveryThreshold}, typically next business day within the {storeConfig.city} area.
          </p>
          <p>
            <b className="font-semibold text-primary">Returns:</b> 14-day returns on unopened items; opened items
            subject to inspection. Warranty service handled in-store.
          </p>
        </div>
      ),
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ProductJsonLd product={product} detail={detail} />
      <Navbar />
      <main className="flex-1 pb-[76px] lg:pb-0">
        <Container>
          <Breadcrumbs items={breadcrumbItems} />

          <div className="grid gap-6 pb-2 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-10">
            <ProductGallery product={product} />
            <BuyBox product={product} detail={detail} />
          </div>

          <ProductTabs tabs={tabs} />

          <section className="pb-14 pt-5">
            <RelatedProductsHeading />
            <ProductGrid products={related} gridColsClassName="grid grid-cols-2 gap-3.5 sm:grid-cols-4" />
          </section>
        </Container>
      </main>
      <Footer />
      <StickyBuyBar product={product} />
    </>
  );
}
