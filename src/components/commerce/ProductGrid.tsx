import type { ReactNode } from "react";
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
  gridColsClassName?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  className?: string;
}

const defaultGridClasses = "grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4";

export function ProductGrid({
  products,
  loading,
  error,
  onRetry,
  skeletonCount = 8,
  gridColsClassName = defaultGridClasses,
  emptyTitle = "No deals available right now",
  emptyDescription = "Check back soon — new deals are added every week.",
  emptyAction,
  className,
}: ProductGridProps) {
  if (error) {
    return <ErrorBanner message={error} onRetry={onRetry} />;
  }

  if (loading) {
    return (
      <div className={[gridColsClassName, className ?? ""].filter(Boolean).join(" ")}>
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
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <div className={[gridColsClassName, className ?? ""].filter(Boolean).join(" ")}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
