"use client";

import { useLanguage } from "@/lib/useLanguage";

export interface CatalogHeaderProps {
  total: number;
  categoryName?: string;
}

export function CatalogHeader({ total, categoryName }: CatalogHeaderProps) {
  const { t } = useLanguage();

  const title = categoryName || t("allProducts");
  const subtitle = t("productsMetrics").replace("{count}", String(total));

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-primary">{title}</h1>
      <p className="mt-1 text-[13px] text-secondary">
        {subtitle}
      </p>
    </div>
  );
}
