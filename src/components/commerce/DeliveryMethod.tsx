import { CheckoutStepCard } from "@/components/commerce/CheckoutStepCard";
import { formatCurrency } from "@/lib/currency";
import { storeConfig } from "@/config/store";
import { computeDeliveryFee, type CheckoutDeliveryMethod } from "@/lib/checkout";
import { useLanguage } from "@/lib/useLanguage";

export interface DeliveryMethodProps {
  value: CheckoutDeliveryMethod;
  onChange: (method: CheckoutDeliveryMethod) => void;
  subtotal: number;
}

export function DeliveryMethod({ value, onChange, subtotal }: DeliveryMethodProps) {
  const { t } = useLanguage();
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
      title: t("sameDayPickupTitle"),
      description: `${storeConfig.name} · ${storeConfig.address.line1}, ${storeConfig.city} — ${t("pickupReadyEstimate")}`,
      price: t("free"),
      priceClassName: "text-success",
    },
    {
      id: "delivery",
      title: t("localDelivery"),
      description: t("deliveryDescription").replace("{city}", storeConfig.city),
      price: deliveryFee === 0 ? t("freeOverAmount").replace("{amount}", formatCurrency(storeConfig.freeDeliveryThreshold)) : formatCurrency(deliveryFee),
      priceClassName: deliveryFee === 0 ? "text-success" : "text-primary",
    },
  ];

  return (
    <CheckoutStepCard step={2} title={t("deliveryMethod")}>
      <div role="radiogroup" aria-label={t("deliveryMethod")} className="grid gap-2.5">
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
