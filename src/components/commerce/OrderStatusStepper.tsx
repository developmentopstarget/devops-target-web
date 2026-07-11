import { CheckIcon } from "@/components/ui/icons";
import type { CheckoutDeliveryMethod, OrderStatus } from "@/lib/checkout";

export interface OrderStatusStepperProps {
  status: OrderStatus;
  deliveryMethod: CheckoutDeliveryMethod;
  className?: string;
}

const STATUS_ORDER: OrderStatus[] = ["placed", "paid", "fulfilling", "completed"];

import { useLanguage } from "@/lib/useLanguage";

export function OrderStatusStepper({ status, deliveryMethod, className }: OrderStatusStepperProps) {
  const { t } = useLanguage();
  const currentIndex = STATUS_ORDER.indexOf(status);

  const steps: Array<{ key: OrderStatus; label: string }> = [
    { key: "placed", label: t("statusPlaced") },
    { key: "paid", label: t("statusPaid") },
    { key: "fulfilling", label: deliveryMethod === "pickup" ? t("statusReadyForPickup") : t("statusShipped") },
    { key: "completed", label: deliveryMethod === "pickup" ? t("statusPickedUp") : t("statusDelivered") },
  ];

  return (
    <ol className={["flex flex-col gap-0 sm:flex-row sm:items-start", className ?? ""].filter(Boolean).join(" ")}>
      {steps.map((step, i) => {
        const done = i <= currentIndex;
        const isLast = i === steps.length - 1;
        return (
          <li key={step.key} className="flex flex-1 sm:flex-col sm:items-center">
            <div className="flex items-center sm:w-full">
              <span
                className={[
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold",
                  done ? "bg-accent text-white" : "bg-surface-2 text-tertiary",
                ].join(" ")}
                aria-hidden="true"
              >
                {done ? <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
              </span>
              {!isLast && (
                <span
                  className={[
                    "mx-2 h-0.5 w-8 shrink-0 sm:mx-0 sm:mt-3.5 sm:h-0.5 sm:w-full sm:flex-1",
                    i < currentIndex ? "bg-accent" : "bg-border",
                  ].join(" ")}
                  aria-hidden="true"
                />
              )}
            </div>
            <span
              className={[
                "ms-2.5 mt-0 text-[12.5px] font-semibold sm:ms-0 sm:mt-2 sm:text-center",
                done ? "text-primary" : "text-tertiary",
              ].join(" ")}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
