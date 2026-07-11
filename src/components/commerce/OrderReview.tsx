import { ComponentsIcon } from "@/components/ui/icons";
import { formatCurrency } from "@/lib/currency";
import type { CheckoutOrder } from "@/lib/checkout";
import { useLanguage } from "@/lib/useLanguage";

export interface OrderReviewProps {
  order: CheckoutOrder;
  className?: string;
}

export function OrderReview({ order, className }: OrderReviewProps) {
  const { t } = useLanguage();

  return (
    <div
      className={["rounded-xl border border-border bg-surface p-4.5 shadow-sm", className ?? ""]
        .filter(Boolean)
        .join(" ")}
    >
      <h2 className="mb-3.5 text-base font-bold text-primary">{t("orderSummary")}</h2>

      <ul className="flex flex-col gap-2.5">
        {order.items.map((item) => (
          <li key={item.productId} className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-border-strong">
              <ComponentsIcon className="h-5.5 w-5.5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold text-primary">{item.name}</span>
              <span className="block text-[11.5px] text-tertiary">
                {item.spec} · {t("qty")} {item.quantity}
              </span>
            </span>
            <span className="shrink-0 font-mono text-[13px] font-bold text-primary">
              {formatCurrency(item.unitPrice * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <dl className="mt-3 border-t border-border pt-3">
        <div className="flex justify-between py-1.5 text-[13.5px] text-secondary">
          <dt>{t("subtotal")}</dt>
          <dd className="font-mono font-semibold text-primary">{formatCurrency(order.subtotal)}</dd>
        </div>
        {order.promoCode && (
          <div className="flex justify-between py-1.5 text-[13.5px] text-secondary">
            <dt>{t("promo")} ({order.promoCode})</dt>
            <dd className="font-mono font-semibold text-success">−{formatCurrency(order.discount)}</dd>
          </div>
        )}
        <div className="flex justify-between py-1.5 text-[13.5px] text-secondary">
          <dt>{order.deliveryMethod === "pickup" ? t("pickup") : t("delivery")}</dt>
          <dd className={order.deliveryFee === 0 ? "text-xs font-bold text-success" : "font-mono font-semibold text-primary"}>
            {order.deliveryFee === 0 ? t("free") : formatCurrency(order.deliveryFee)}
          </dd>
        </div>
        <div className="flex justify-between py-1.5 text-[13.5px] text-secondary">
          <dt>{t("estimatedTax")}</dt>
          <dd className="font-mono font-semibold text-primary">{formatCurrency(order.tax)}</dd>
        </div>
        <div className="mt-1.5 flex items-baseline justify-between border-t border-border pt-3 font-bold">
          <dt className="text-[15px] text-primary">{t("total")}</dt>
          <dd className="font-mono text-lg tracking-tight text-primary">{formatCurrency(order.total)}</dd>
        </div>
      </dl>
    </div>
  );
}
