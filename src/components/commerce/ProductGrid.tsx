import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonProductCard } from "@/components/ui/Skeleton";
import { ComponentsIcon } from "@/components/ui/icons";
import { ProductCard } from "@/components/commerce/ProductCard";
import type { Product } from "@/data/products";

export interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  skeletonCount?: number;
  className?: string;
}

const gridClasses = "grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4";

export function ProductGrid({
  products,
  loading,
  error,
  onRetry,
  skeletonCount = 8,
  className,
}: ProductGridProps) {
  if (error) {
    return <ErrorBanner message={error} onRetry={onRetry} />;
  }

  if (loading) {
    return (
      <div className={[gridClasses, className ?? ""].filter(Boolean).join(" ")}>
        {Array.from({ length: skeletonCount }, (_, i) => (
          <SkeletonProductCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<ComponentsIcon className="h-5 w-5" aria-hidden="true" />}
        title="No deals available right now"
        description="Check back soon — new deals are added every week."
      />
    );
  }

  return (
    <div className={[gridClasses, className ?? ""].filter(Boolean).join(" ")}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
