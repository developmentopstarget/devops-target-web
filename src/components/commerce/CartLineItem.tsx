import { ComponentsIcon, TrashIcon } from "@/components/ui/icons";
import { StockBadge } from "@/components/commerce/StockBadge";
import { QtyStepper } from "@/components/commerce/QtyStepper";
import { formatCurrency } from "@/lib/currency";
import type { CartItem } from "@/components/commerce/CartProvider";

export interface CartLineItemProps {
  item: CartItem;
  onQtyChange: (quantity: number) => void;
  onRemove: () => void;
}

export function CartLineItem({ item, onQtyChange, onRemove }: CartLineItemProps) {
  const unavailable = item.stock === "out-of-stock";
  const lineTotal = item.unitPrice * item.quantity;

  return (
    <div className="grid grid-cols-[84px_1fr] gap-3.5 rounded-xl border border-border bg-surface p-3.5 shadow-sm">
      <div
        className={[
          "grid h-21 w-21 place-items-center rounded-[10px] bg-surface-2 bg-[radial-gradient(110%_110%_at_30%_10%,var(--accent-soft),transparent_60%)] text-border-strong",
          unavailable ? "opacity-50 grayscale" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <ComponentsIcon className="h-9.5 w-9.5" aria-hidden="true" />
      </div>

      <div className="flex min-w-0 flex-col gap-1">
        {item.brand && (
          <div className="text-[11.5px] font-semibold uppercase tracking-wide text-accent">{item.brand}</div>
        )}
        <div className="text-[14.5px] font-semibold leading-snug text-primary">{item.name}</div>
        <p className="text-xs text-secondary">{item.spec}</p>
        <StockBadge stock={item.stock} lowStockLabel={`Low stock — ${item.maxStock} left`} className="w-max" />

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2.5 pt-1.5">
          <QtyStepper
            value={item.quantity}
            min={1}
            max={Math.max(item.maxStock, 1)}
            onChange={onQtyChange}
            disabled={unavailable}
          />
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remove ${item.name} from cart`}
              className="flex items-center gap-1.25 text-xs font-semibold text-tertiary hover:text-danger"
            >
              <TrashIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Remove
            </button>
            <span className="font-mono text-[15px] font-bold text-primary">{formatCurrency(lineTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
