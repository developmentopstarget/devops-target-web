import { JsonLdScript } from "@/components/seo/JsonLdScript";
import type { Product } from "@/data/products";
import type { ProductDetail } from "@/data/product-details";

function availabilityFor(stock: Product["stock"]) {
  if (stock === "out-of-stock") return "https://schema.org/OutOfStock";
  if (stock === "low-stock") return "https://schema.org/LimitedAvailability";
  return "https://schema.org/InStock";
}

export interface ProductJsonLdProps {
  product: Product;
  detail: ProductDetail;
}

export function ProductJsonLd({ product, detail }: ProductJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: detail.sku,
    description: detail.description.join(" "),
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
    ...(product.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
    ...(detail.reviews.length > 0
      ? {
          review: detail.reviews.map((review) => ({
            "@type": "Review",
            author: { "@type": "Person", name: review.author },
            datePublished: review.date,
            reviewBody: review.body,
            reviewRating: { "@type": "Rating", ratingValue: review.rating, bestRating: 5 },
          })),
        }
      : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability: availabilityFor(product.stock),
    },
  };

  return <JsonLdScript schema={schema} />;
}
