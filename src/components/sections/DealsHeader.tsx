"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/useLanguage";

export function DealsHeader() {
  const { t, lang } = useLanguage();

  const title = lang === "fa" ? "تخفیف‌های این هفته" : "This week's deals";
  const seeAllText = lang === "fa" ? "مشاهده همه تخفیف‌ها ←" : "See all deals →";

  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-primary sm:text-xl">
          {title}
        </h2>
        <p className="mt-0.75 text-[13.5px] text-secondary">
          {t("handpickedStoreTeam")}
        </p>
      </div>
      <Link
        href="/deals"
        className="whitespace-nowrap text-[13px] font-semibold text-accent hover:text-accent-hover"
      >
        {seeAllText}
      </Link>
    </div>
  );
}
