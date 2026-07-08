export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={["animate-pulse rounded-md bg-surface-2", className ?? ""].join(" ")}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({ className }: { className?: string }) {
  return <Skeleton className={["h-3.5 w-full", className ?? ""].join(" ")} />;
}

export function SkeletonProductCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-2 p-3">
        <SkeletonText className="w-4/5" />
        <SkeletonText className="w-3/5" />
        <SkeletonText className="w-2/5" />
        <Skeleton className="mt-2 h-9 w-full rounded-lg" />
      </div>
    </div>
  );
}
