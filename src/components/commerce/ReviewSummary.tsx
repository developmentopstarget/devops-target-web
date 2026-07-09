"use client";

import { Button } from "@/components/ui/Button";
import { StarIcon } from "@/components/ui/icons";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/lib/useLanguage";

export interface ReviewSummaryProps {
  rating: number;
  reviewCount: number;
  className?: string;
}

export function ReviewSummary({ rating, reviewCount, className }: ReviewSummaryProps) {
  const { show } = useToast();
  const { t, lang } = useLanguage();
  const rounded = Math.round(rating);

  return (
    <div className={["mb-5 flex flex-wrap items-center gap-6", className ?? ""].filter(Boolean).join(" ")}>
      <div>
        <div className="text-[44px] font-extrabold leading-none text-primary">{rating.toFixed(1)}</div>
        <div className="mt-1.5 flex gap-0.5 text-warning" aria-hidden="true">
          {Array.from({ length: 5 }, (_, i) => (
            <StarIcon key={i} className={`h-4 w-4 ${i < rounded ? "" : "opacity-25"}`} />
          ))}
        </div>
        <div className="mt-1 text-xs text-tertiary">
          {lang === "fa" ? `${reviewCount} نظر` : `${reviewCount} reviews`}
        </div>
      </div>
      <Button
        type="button"
        variant="secondary"
        onClick={() => show(lang === "fa" ? "فرم ثبت نظر به زودی اضافه می‌شود — به زودی دوباره سر بزنید." : "Review form is coming soon — check back shortly.", "info")}
      >
        {t("writeReview")}
      </Button>
    </div>
  );
}
