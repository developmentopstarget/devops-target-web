"use client";

import { useLanguage } from "@/lib/useLanguage";

export function RelatedProductsHeading() {
  const { t } = useLanguage();
  return (
    <h2 className="mb-4.5 text-xl font-bold tracking-tight text-primary">
      {t("mightLike")}
    </h2>
  );
}
