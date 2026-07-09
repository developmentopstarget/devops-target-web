import { formatCurrency } from "@/lib/currency";

export type PriceTagSize = "sm" | "lg";

export interface PriceTagProps {
  amount: number;
  currency?: string;
  compareAt?: number;
  size?: PriceTagSize;
  className?: string;
}

const sizeClasses: Record<PriceTagSize, { price: string; compareAt: string }> = {
  sm: { price: "text-[15px]", compareAt: "text-xs" },
  lg: { price: "text-xl sm:text-2xl", compareAt: "text-sm" },
};

export function PriceTag({ amount, currency = "USD", compareAt, size = "sm", className }: PriceTagProps) {
  const onSale = compareAt !== undefined && compareAt > amount;
  const { price, compareAt: compareAtClass } = sizeClasses[size];

  return (
    <div className={["flex items-baseline gap-2 font-mono", className ?? ""].filter(Boolean).join(" ")}>
      <span className={["font-bold tracking-tight", price, onSale ? "text-danger" : "text-primary"].join(" ")}>
        {formatCurrency(amount, currency)}
      </span>
      {onSale && (
        <span className={["text-tertiary line-through", compareAtClass].join(" ")}>
          {formatCurrency(compareAt, currency)}
        </span>
      )}
    </div>
  );
}
