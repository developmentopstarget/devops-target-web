import type { StockStatus } from "@/data/products";

export interface StockBadgeProps {
  stock: StockStatus;
  lowStockLabel?: string;
  className?: string;
}

const stockConfig: Record<StockStatus, { label: string; dot: string; bg: string; text: string }> = {
  "in-stock": { label: "In stock", dot: "bg-success", bg: "bg-success/15", text: "text-success" },
  "low-stock": { label: "Low stock", dot: "bg-warning", bg: "bg-warning/15", text: "text-warning" },
  "out-of-stock": { label: "Out of stock", dot: "bg-danger", bg: "bg-danger/15", text: "text-danger" },
};

export function StockBadge({ stock, lowStockLabel, className }: StockBadgeProps) {
  const config = stockConfig[stock];
  const label = stock === "low-stock" && lowStockLabel ? lowStockLabel : config.label;

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
