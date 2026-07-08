import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";
import { StarIcon } from "@/components/ui/icons";
import type { ProductReview } from "@/data/product-details";

export interface ReviewListProps {
  reviews: ProductReview[];
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  className?: string;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function ReviewList({ reviews, loading, error, onRetry, className }: ReviewListProps) {
  if (error) {
    return <ErrorBanner message={error} onRetry={onRetry} />;
  }

  if (loading) {
    return (
      <div className={["flex flex-col gap-4", className ?? ""].filter(Boolean).join(" ")}>
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="flex flex-col gap-2 border-t border-border pt-4">
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-8 w-8 rounded-full" />
              <SkeletonText className="w-24" />
            </div>
            <SkeletonText className="w-full" />
            <SkeletonText className="w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <EmptyState
        icon={<StarIcon className="h-5 w-5" aria-hidden="true" />}
        title="Be the first to review"
        description="Share what you think once you've tried this product."
      />
    );
  }

  return (
    <div className={className}>
      {reviews.map((review) => (
        <div key={review.id} className="border-t border-border py-4 first:border-t-0 first:pt-0">
          <div className="mb-1.5 flex items-center gap-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-soft text-[13px] font-bold text-accent">
              {initials(review.author)}
            </span>
            <span className="text-[13px] font-semibold text-primary">{review.author}</span>
            <span className="flex gap-px text-warning" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon key={i} className={`h-3 w-3 ${i < review.rating ? "" : "opacity-25"}`} />
              ))}
            </span>
            <span className="ms-auto text-xs text-tertiary">{formatDate(review.date)}</span>
          </div>
          <p className="max-w-[70ch] text-[13.5px] text-secondary">{review.body}</p>
        </div>
      ))}
    </div>
  );
}
