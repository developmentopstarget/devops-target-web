"use client";

import Link from "next/link";
import { categoryIcons } from "@/components/ui/icons";
import { categories } from "@/data/categories";
import { Container } from "@/components/layout/Container";
import { useLanguage } from "@/lib/useLanguage";

export function CategoryTiles() {
  const { t, lang } = useLanguage();

  const getCategoryTranslation = (slug: string, field: "name" | "count", fallback: string) => {
    if (lang !== "fa") return fallback;
    const categoryMap: Record<string, { name: string; count: string }> = {
      "laptops": { name: "لپتاپ‌ها", count: "۲۴۰+ موجود در انبار" },
      "desktops-pcs": { name: "کیس و کامپیوتر", count: "۱۲۰+ سیستم آماده" },
      "components": { name: "قطعات", count: "گرافیک · پردازنده · رم" },
      "monitors": { name: "مانیتورها", count: "۹۰+ مدل" },
      "peripherals": { name: "لوازم جانبی", count: "کیبورد · ماوس · صوتی" },
      "networking": { name: "تجهیزات شبکه", count: "روتر و تجهیزات" },
    };
    return categoryMap[slug]?.[field] || fallback;
  };

  return (
    <section className="py-10 lg:py-14">
      <Container>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-primary sm:text-xl">
              {t("shopByCategory")}
            </h2>
            <p className="mt-0.75 text-[13.5px] text-secondary">
              {t("workPlayBuilding")}
            </p>
          </div>
          <Link href="/products" className="whitespace-nowrap text-[13px] font-semibold text-accent hover:text-accent-hover">
            {t("allCategories")}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => {
            const Icon = categoryIcons[category.icon];
            return (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="flex flex-col gap-2.5 rounded-xl border border-border bg-surface p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-accent-soft text-accent">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-primary">
                  {getCategoryTranslation(category.slug, "name", category.name)}
                </span>
                <span className="text-xs text-tertiary">
                  {getCategoryTranslation(category.slug, "count", category.count)}
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
