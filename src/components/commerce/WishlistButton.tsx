"use client";

import { useState } from "react";
import { HeartIcon } from "@/components/ui/icons";

export interface WishlistButtonProps {
  productName: string;
  className?: string;
}

export function WishlistButton({ productName, className }: WishlistButtonProps) {
  const [saved, setSaved] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${productName} from wishlist` : `Add ${productName} to wishlist`}
      onClick={() => setSaved((v) => !v)}
      className={[
        "grid h-11 w-11 shrink-0 place-items-center rounded-lg border transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        saved ? "border-danger bg-danger/10 text-danger" : "border-border-strong bg-surface text-secondary hover:bg-surface-2",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <HeartIcon className="h-[18px] w-[18px]" fill={saved ? "currentColor" : "none"} aria-hidden="true" />
    </button>
  );
}
