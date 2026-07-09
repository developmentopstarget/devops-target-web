import { CheckoutStepCard } from "@/components/commerce/CheckoutStepCard";
import { formatCurrency } from "@/lib/currency";
import { storeConfig } from "@/config/store";
import { computeDeliveryFee, PICKUP_READY_ESTIMATE, type CheckoutDeliveryMethod } from "@/lib/checkout";

export interface DeliveryMethodProps {
  value: CheckoutDeliveryMethod;
  onChange: (method: CheckoutDeliveryMethod) => void;
  subtotal: number;
}

export function DeliveryMethod({ value, onChange, subtotal }: DeliveryMethodProps) {
  const deliveryFee = computeDeliveryFee("delivery", subtotal);

  const options: Array<{
    id: CheckoutDeliveryMethod;
    title: string;
    description: string;
    price: string;
    priceClassName: string;
  }> = [
    {
      id: "pickup",
      title: "Same-day pickup",
      description: `${storeConfig.name} · ${storeConfig.address.line1}, ${storeConfig.city} — ${PICKUP_READY_ESTIMATE}`,
      price: "FREE",
      priceClassName: "text-success",
    },
    {
      id: "delivery",
      title: "Local delivery",
      description: `${storeConfig.city} area · next business day`,
      price: deliveryFee === 0 ? `FREE over ${formatCurrency(storeConfig.freeDeliveryThreshold)}` : formatCurrency(deliveryFee),
      priceClassName: deliveryFee === 0 ? "text-success" : "text-primary",
    },
  ];

  return (
    <CheckoutStepCard step={2} title="Delivery method">
      <div role="radiogroup" aria-label="Delivery method" className="grid gap-2.5">
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <label
              key={option.id}
              className={[
                "flex cursor-pointer items-start gap-3 rounded-[10px] border p-3.5",
                selected ? "border-accent bg-accent-soft" : "border-border-strong",
              ].join(" ")}
            >
              <input
                type="radio"
                name="delivery-method"
                checked={selected}
                onChange={() => onChange(option.id)}
                className="mt-0.5 h-4 w-4 accent-accent"
              />
              <span className="flex-1">
                <span className="block text-sm font-semibold text-primary">{option.title}</span>
                <span className="block text-xs text-secondary">{option.description}</span>
              </span>
              <span className={`text-[13px] font-bold ${option.priceClassName}`}>{option.price}</span>
            </label>
          );
        })}
      </div>
    </CheckoutStepCard>
  );
}
