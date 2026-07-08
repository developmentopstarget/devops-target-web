import { storeConfig } from "@/config/store";
import { dealsOfTheWeek, type Product } from "@/data/products";

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
        // Static, developer-authored config only — never interpolates user input.
        // The `<` escape prevents a stray "</script>" from breaking out of the tag.
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}
