"use client";

import { CheckoutHeader } from "@/components/layout/CheckoutHeader";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { CartIcon } from "@/components/ui/icons";
import { OrderConfirmation } from "@/components/commerce/OrderConfirmation";
import { OrderStatusStepper } from "@/components/commerce/OrderStatusStepper";
import { OrderReview } from "@/components/commerce/OrderReview";
import { useRouter } from "next/navigation";
import { readOrder } from "@/lib/checkout";
import { useMounted } from "@/lib/useMounted";
import { useLanguage } from "@/lib/useLanguage";

export default function CheckoutSuccessPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const mounted = useMounted();
  const order = mounted ? readOrder() : null;

  return (
    <>
      <CheckoutHeader />
      <main className="flex-1">
        <Container className="max-w-2xl py-10 max-w-full overflow-x-hidden box-border">
          {!mounted ? null : !order ? (
            <EmptyState
              icon={<CartIcon className="h-6 w-6" aria-hidden="true" />}
              title={t("noRecentOrderFound")}
              description={t("noRecentOrderDescription")}
              action={
                <Button as="a" href="/products">
                  {t("startShopping")}
                </Button>
              }
              className="py-16"
            />
          ) : (
            <>
              <OrderConfirmation order={order} />

              <OrderStatusStepper
                status={order.status}
                deliveryMethod={order.deliveryMethod}
                className="mt-8 rounded-xl border border-border bg-surface p-4.5 shadow-sm"
              />

              <OrderReview order={order} className="mt-5" />

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <Button as="a" href="/products" variant="secondary" fullWidth>
                  {t("continueShopping")}
                </Button>
                <Button
                  type="button"
                  fullWidth
                  onClick={() => router.push("/account/orders")}
                >
                  {t("viewOrder")}
                </Button>
              </div>
            </>
          )}
        </Container>
      </main>
    </>
  );
}
