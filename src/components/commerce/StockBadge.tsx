"use client";

import type { StockStatus } from "@/data/products";
import { useLanguage } from "@/lib/useLanguage";

export interface StockBadgeProps {
  stock: StockStatus;
  lowStockLabel?: string;
  className?: string;
}

export function StockBadge({ stock, lowStockLabel, className }: StockBadgeProps) {
  const { lang } = useLanguage();

  const stockTranslations: Record<StockStatus, string> = {
    "in-stock": lang === "fa" ? "موجود" : "In stock",
    "low-stock": lang === "fa" ? "موجودی کم" : "Low stock",
    "out-of-stock": lang === "fa" ? "ناموجود" : "Out of stock",
  };

  const config = {
    "in-stock": { dot: "bg-success", bg: "bg-success/15", text: "text-success" },
    "low-stock": { dot: "bg-warning", bg: "bg-warning/15", text: "text-warning" },
    "out-of-stock": { dot: "bg-danger", bg: "bg-danger/15", text: "text-danger" },
  }[stock];

  const defaultLabel = stockTranslations[stock];
  const label = stock === "low-stock" && lowStockLabel ? lowStockLabel : defaultLabel;

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-[7px] px-2 py-1 text-[10.5px] font-bold",
        config.bg,
        config.text,
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className={["h-1.5 w-1.5 rounded-full", config.dot].join(" ")} aria-hidden="true" />
      {label}
    </span>
  );
}
