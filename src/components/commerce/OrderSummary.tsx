"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ShieldCheckIcon, TruckIcon } from "@/components/ui/icons";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/currency";
import { storeConfig } from "@/config/store";
import { PromoCode, type AppliedPromo } from "@/components/commerce/PromoCode";
import type { CartItem } from "@/components/commerce/CartProvider";

export interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  className?: string;
}

// Placeholders — real rates/fees come from the Django API + tax service later.
const TAX_RATE = 0.08;
const FLAT_DELIVERY_FEE = 9.99;

export function OrderSummary({ items, subtotal, className }: OrderSummaryProps) {
  const { show } = useToast();
  const [promo, setPromo] = useState<AppliedPromo | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);

  const hasUnavailableItem = items.some((item) => item.stock === "out-of-stock");
  const discount = promo ? subtotal * promo.discountRate : 0;
  const deliveryFee = subtotal >= storeConfig.freeDeliveryThreshold ? 0 : FLAT_DELIVERY_FEE;
  const tax = TAX_RATE * (subtotal - discount);
  const total = subtotal - discount + deliveryFee + tax;
  const checkoutDisabled = items.length === 0 || hasUnavailableItem;

  function handleCheckout() {
    setCheckingOut(true);
    window.setTimeout(() => {
      setCheckingOut(false);
      show("Checkout isn't wired up yet in this preview.", "info");
    }, 700);
  }

  return (
    <aside
      className={[
        "rounded-xl border border-border bg-surface p-4.5 shadow-sm min-[960px]:sticky min-[960px]:top-20",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <h2 className="mb-3.5 text-base font-bold text-primary">Order summary</h2>

      <PromoCode applied={promo} onApply={setPromo} onRemove={() => setPromo(null)} />

      {hasUnavailableItem && (
        <p className="mb-3 rounded-lg bg-danger/10 px-3 py-2 text-xs font-medium text-danger">
          Remove out-of-stock items to check out.
        </p>
      )}

      <dl aria-live="polite">
        <div className="flex justify-between py-1.75 text-[13.5px] text-secondary">
          <dt>Subtotal</dt>
          <dd className="font-mono font-semibold text-primary">{formatCurrency(subtotal)}</dd>
        </div>
        {promo && (
          <div className="flex justify-between py-1.75 text-[13.5px] text-secondary">
            <dt>Promo ({promo.code})</dt>
            <dd className="font-mono font-semibold text-success">−{formatCurrency(discount)}</dd>
          </div>
        )}
        <div className="flex justify-between py-1.75 text-[13.5px] text-secondary">
          <dt>Local delivery</dt>
          <dd className={deliveryFee === 0 ? "text-xs font-bold text-success" : "font-mono font-semibold text-primary"}>
            {deliveryFee === 0 ? "FREE" : formatCurrency(deliveryFee)}
          </dd>
        </div>
        <div className="flex justify-between py-1.75 text-[13.5px] text-secondary">
          <dt>Estimated tax</dt>
          <dd className="font-mono font-semibold text-primary">{formatCurrency(tax)}</dd>
        </div>
        <div className="mt-2 flex items-baseline justify-between border-t border-border pt-3.5 font-bold">
          <dt className="text-[15px] text-primary">Total</dt>
          <dd className="font-mono text-[22px] tracking-tight text-primary">{formatCurrency(total)}</dd>
        </div>
      </dl>

      <Button
        type="button"
        fullWidth
        size="lg"
        className="mt-4"
        disabled={checkoutDisabled}
        loading={checkingOut}
        onClick={handleCheckout}
      >
        Checkout →
      </Button>

      <ul className="mt-3.5 flex flex-col gap-2">
        <li className="flex gap-2 text-xs text-secondary">
          <ShieldCheckIcon className="mt-0.5 h-[15px] w-[15px] shrink-0 text-accent" aria-hidden="true" />
          Secure checkout · Stripe
        </li>
        <li className="flex gap-2 text-xs text-secondary">
          <TruckIcon className="mt-0.5 h-[15px] w-[15px] shrink-0 text-accent" aria-hidden="true" />
          Free local delivery over {formatCurrency(storeConfig.freeDeliveryThreshold)}, or same-day pickup
        </li>
      </ul>

      <div className="mt-3.5 flex justify-center gap-1.5">
        {["VISA", "MC", "AMEX", "PAY"].map((mark) => (
          <span
            key={mark}
            className="flex h-[23px] w-9 items-center justify-center rounded-[5px] border border-border bg-surface-2 text-[8px] font-bold text-secondary"
          >
            {mark}
          </span>
        ))}
      </div>
    </aside>
  );
}
