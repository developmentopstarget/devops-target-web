"use client";

import { StarIcon } from "@/components/ui/icons";
import { useLanguage } from "@/lib/useLanguage";

export interface RatingProps {
  value: number;
  count?: number;
  readOnly?: boolean;
  className?: string;
}

export function Rating({ value, count, className }: RatingProps) {
  const rounded = Math.round(value);
  const { lang } = useLanguage();

  const ariaLabel = lang === "fa"
    ? `امتیاز ${value} از ۵${count ? ` از ${count} نظر` : ""}`
    : `Rated ${value} out of 5${count ? ` from ${count} reviews` : ""}`;

  return (
    <div
      className={["flex items-center gap-1.5 text-xs text-tertiary", className ?? ""].join(" ")}
      role="img"
      aria-label={ariaLabel}
    >
      <span className="flex gap-px text-warning">
        {Array.from({ length: 5 }, (_, i) => (
          <StarIcon
            key={i}
            className={`h-3 w-3 ${i < rounded ? "" : "opacity-25"}`}
            aria-hidden="true"
          />
        ))}
      </span>
      <span aria-hidden="true">
        {value.toFixed(1)}
        {count !== undefined ? ` · ${count}` : ""}
      </span>
    </div>
  );
}
