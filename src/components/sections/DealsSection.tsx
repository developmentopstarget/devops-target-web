"use client";

import { useState } from "react";
import { ProductGrid } from "@/components/commerce/ProductGrid";
import type { Product } from "@/data/products";

export interface DealsSectionProps {
  products: Product[];
}

export function DealsSection({ products }: DealsSectionProps) {
  // Placeholder data is used directly today; wiring this to the Django API later
  // means this island can flip `loading`/`error` from a real fetch.
  const [loading] = useState(false);
  const [error] = useState<string | undefined>(undefined);

  return (
    <ProductGrid
      products={products}
      loading={loading}
      error={error}
      onRetry={() => window.location.reload()}
    />
  );
}
