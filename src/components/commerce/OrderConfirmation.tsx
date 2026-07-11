import { CheckIcon, MapPinIcon, TruckIcon } from "@/components/ui/icons";
import { storeConfig } from "@/config/store";
import type { CheckoutOrder } from "@/lib/checkout";
import { useLanguage } from "@/lib/useLanguage";

export interface OrderConfirmationProps {
  order: CheckoutOrder;
  className?: string;
}

export function OrderConfirmation({ order, className }: OrderConfirmationProps) {
  const { t, lang } = useLanguage();
  const placedDate = new Date(order.placedAt);

  return (
    <div className={["flex flex-col items-center text-center", className ?? ""].filter(Boolean).join(" ")}>
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
        <CheckIcon className="h-7 w-7" strokeWidth={2.5} aria-hidden="true" />
      </span>
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-primary">{t("orderConfirmed")}</h1>
      <p className="mt-1.5 text-sm text-secondary">
        Order <span className="font-mono font-semibold text-primary">#{order.orderNumber}</span> ·{" "}
        {placedDate.toLocaleDateString(lang === "fa" ? "fa-IR" : "en-US", { month: "short", day: "numeric", year: "numeric" })}
      </p>
      <p className="mt-1 text-sm text-secondary">{t("orderConfirmationSent").replace("{email}", order.email)}</p>

      <div className="mt-5 flex max-w-md items-start gap-2.5 rounded-xl border border-border bg-surface px-4 py-3.5 text-start shadow-sm">
        {order.deliveryMethod === "pickup" ? (
          <>
            <MapPinIcon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-accent" aria-hidden="true" />
            <span className="text-[13.5px] text-secondary">
              <span className="block font-semibold text-primary">{t("sameDayPickupDetail").replace("{estimate}", t("pickupReadyEstimate"))}</span>
              {storeConfig.name} · {storeConfig.address.line1}, {storeConfig.city}
              {order.pickupContact && (
                <span className="block">
                  {order.pickupContact.firstName} {order.pickupContact.lastName} · {order.pickupContact.phone}
                </span>
              )}
            </span>
          </>
        ) : (
          <>
            <TruckIcon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-accent" aria-hidden="true" />
            <span className="text-[13.5px] text-secondary">
              <span className="block font-semibold text-primary">{t("localDeliveryDetail")}</span>
              {order.address && (
                <>
                  {order.address.firstName} {order.address.lastName}
                  <span className="block">
                    {order.address.line1}, {order.address.city} {order.address.postalCode}
                  </span>
                </>
              )}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
