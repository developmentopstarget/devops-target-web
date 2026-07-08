import { storeConfig } from "@/config/store";
import { dealsOfTheWeek, type Product } from "@/data/products";
import { JsonLdScript } from "@/components/seo/JsonLdScript";

function availabilityFor(stock: Product["stock"]) {
  if (stock === "out-of-stock") return "https://schema.org/OutOfStock";
  if (stock === "low-stock") return "https://schema.org/LimitedAvailability";
  return "https://schema.org/InStock";
}

function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ElectronicsStore",
    name: storeConfig.name,
    telephone: storeConfig.phone,
    email: storeConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: storeConfig.address.line1,
      addressLocality: storeConfig.address.city,
      addressRegion: storeConfig.address.region,
      postalCode: storeConfig.address.postalCode,
      addressCountry: storeConfig.address.country,
    },
    openingHoursSpecification: storeConfig.hours.map((entry) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: entry.dayOfWeek,
      opens: entry.opens,
      closes: entry.closes,
    })),
    sameAs: Object.values(storeConfig.social),
  };
}

function buildProductSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.id,
    category: product.category,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability: availabilityFor(product.stock),
    },
  };
}

export function JsonLd() {
  const schemas = [buildLocalBusinessSchema(), ...dealsOfTheWeek.map(buildProductSchema)];

  return (
    <>
      {schemas.map((schema, index) => (
        <JsonLdScript key={index} schema={schema} />
      ))}
    </>
  );
}
