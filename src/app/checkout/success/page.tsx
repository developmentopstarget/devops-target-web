"use client";

import { CheckoutHeader } from "@/components/layout/CheckoutHeader";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { CartIcon } from "@/components/ui/icons";
import { OrderConfirmation } from "@/components/commerce/OrderConfirmation";
import { OrderStatusStepper } from "@/components/commerce/OrderStatusStepper";
import { OrderReview } from "@/components/commerce/OrderReview";
import { useToast } from "@/components/ui/Toast";
import { readOrder } from "@/lib/checkout";
import { useMounted } from "@/lib/useMounted";

export default function CheckoutSuccessPage() {
  const { show } = useToast();
  const mounted = useMounted();
  const order = mounted ? readOrder() : null;

  return (
    <>
      <CheckoutHeader />
      <main className="flex-1">
        <Container className="max-w-2xl py-10">
          {!mounted ? null : !order ? (
            <EmptyState
              icon={<CartIcon className="h-6 w-6" aria-hidden="true" />}
              title="No recent order found"
              description="We couldn't find an order for this session. If you just completed checkout, check your email for a confirmation."
              action={
                <Button as="a" href="/products">
                  Start shopping
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
                  Continue shopping
                </Button>
                <Button
                  type="button"
                  fullWidth
                  onClick={() => show("Order history isn't available yet in this preview.", "info")}
                >
                  View order
                </Button>
              </div>
            </>
          )}
        </Container>
      </main>
    </>
  );
}
