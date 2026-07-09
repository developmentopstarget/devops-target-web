"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckoutHeader } from "@/components/layout/CheckoutHeader";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { ShieldCheckIcon } from "@/components/ui/icons";
import { ContactStep } from "@/components/commerce/ContactStep";
import { DeliveryMethod } from "@/components/commerce/DeliveryMethod";
import { AddressForm } from "@/components/commerce/AddressForm";
import { PaymentForm, type PaymentFormHandle } from "@/components/commerce/PaymentForm";
import { PromoCode, type AppliedPromo } from "@/components/commerce/PromoCode";
import { useCart } from "@/components/commerce/CartProvider";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/auth/AuthProvider";
import { formatCurrency } from "@/lib/currency";
import { useMounted } from "@/lib/useMounted";
import {
  computeDeliveryFee,
  extractOrderErrorMessage,
  mapApiOrderToCheckoutOrder,
  saveOrder,
  STRIPE_PUBLISHABLE_KEY,
  TAX_RATE,
  type ApiOrder,
  type CheckoutAddress,
  type CheckoutDeliveryMethod,
  type PickupContact,
} from "@/lib/checkout";

const HAS_REAL_STRIPE_KEY = Boolean(STRIPE_PUBLISHABLE_KEY);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emptyAddress: CheckoutAddress = { firstName: "", lastName: "", line1: "", city: "", postalCode: "", phone: "" };
const emptyPickupContact: PickupContact = { firstName: "", lastName: "", phone: "" };

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const { show } = useToast();
  const { user, loading: authLoading } = useAuth();
  const paymentRef = useRef<PaymentFormHandle>(null);
  const mounted = useMounted();

  const [email, setEmail] = useState("");
  const [emailOptIn, setEmailOptIn] = useState(true);
  const [deliveryMethod, setDeliveryMethod] = useState<CheckoutDeliveryMethod>("pickup");
  const [address, setAddress] = useState<CheckoutAddress>(emptyAddress);
  const [pickupContact, setPickupContact] = useState<PickupContact>(emptyPickupContact);
  const [billingSameAsDelivery, setBillingSameAsDelivery] = useState(true);
  const [promo, setPromo] = useState<AppliedPromo | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (mounted && !placingOrder && items.length === 0) {
      router.replace("/cart");
    }
  }, [mounted, items.length, placingOrder, router]);

  if (!mounted || items.length === 0) return null;

  const hasUnavailableItem = items.some((item) => item.stock === "out-of-stock");
  const discount = promo ? subtotal * promo.discountRate : 0;
  const deliveryFee = computeDeliveryFee(deliveryMethod, subtotal);
  const tax = TAX_RATE * (subtotal - discount);
  const total = subtotal - discount + deliveryFee + tax;

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    if (!email.trim()) {
      next.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(email.trim())) {
      next.email = "Enter a valid email address.";
    }

    if (deliveryMethod === "delivery") {
      if (!address.firstName.trim()) next.firstName = "Required.";
      if (!address.lastName.trim()) next.lastName = "Required.";
      if (!address.line1.trim()) next.line1 = "Required.";
      if (!address.city.trim()) next.city = "Required.";
      if (!address.postalCode.trim()) next.postalCode = "Required.";
      if (!address.phone.trim()) next.phone = "Required.";
    } else {
      if (!pickupContact.firstName.trim()) next.firstName = "Required.";
      if (!pickupContact.lastName.trim()) next.lastName = "Required.";
      if (!pickupContact.phone.trim()) next.phone = "Required.";
    }

    return next;
  }

  async function handlePay() {
    if (!user) {
      router.push("/login?next=/checkout");
      return;
    }

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      show("Please fix the highlighted fields.", "error");
      return;
    }

    setPaymentError(null);
    setSubmitting(true);

    // Step 1: create the real order server-side. Django recomputes totals and
    // decrements stock, so this is the source of truth for what actually happened.
    let apiOrder: ApiOrder;
    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fulfillment: deliveryMethod,
          items: items.map((item) => ({ product: item.slug, quantity: item.quantity })),
          promo_code: promo?.code,
          address: deliveryMethod === "delivery" ? address : undefined,
        }),
      });

      if (orderRes.status === 401) {
        router.push("/login?next=/checkout");
        setSubmitting(false);
        return;
      }

      const orderData = await orderRes.json().catch(() => null);
      if (!orderRes.ok) {
        setPaymentError(extractOrderErrorMessage(orderData) ?? "Could not place your order. Please try again.");
        setSubmitting(false);
        return;
      }

      apiOrder = orderData as ApiOrder;
    } catch {
      setPaymentError("Could not reach the server. Please try again.");
      setSubmitting(false);
      return;
    }

    // Step 2: get a PaymentIntent client secret for this order.
    let clientSecret: string | undefined;
    try {
      const intentRes = await fetch("/api/checkout/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: apiOrder.id }),
      });

      if (intentRes.ok) {
        const intentData = await intentRes.json();
        clientSecret = intentData.client_secret;
      } else if (HAS_REAL_STRIPE_KEY) {
        const intentData = await intentRes.json().catch(() => null);
        setPaymentError(extractOrderErrorMessage(intentData) ?? "Could not initialize payment. Please try again.");
        setSubmitting(false);
        return;
      }
      // Without a real publishable key we're in demo mode: the order already exists
      // (visible in Django admin), so a failed/skipped intent call isn't fatal —
      // fall through to the simulated confirm below.
    } catch {
      if (HAS_REAL_STRIPE_KEY) {
        setPaymentError("Could not reach the payment server. Please try again.");
        setSubmitting(false);
        return;
      }
    }

    // Step 3: confirm payment — real Stripe Elements if configured, otherwise simulated.
    const result = await paymentRef.current?.confirmPayment(clientSecret);

    if (!result?.ok) {
      setPaymentError(result?.message ?? "Payment failed. Please try again.");
      setSubmitting(false);
      return;
    }

    const order = mapApiOrderToCheckoutOrder(apiOrder, {
      email: email.trim(),
      deliveryMethod,
      address: deliveryMethod === "delivery" ? address : undefined,
      pickupContact: deliveryMethod === "pickup" ? pickupContact : undefined,
      items,
    });

    setPlacingOrder(true);
    saveOrder(order);
    clear();
    router.push("/checkout/success");
  }

  return (
    <>
      <CheckoutHeader />
      <main className="flex-1 max-w-full overflow-x-hidden box-border">
        <Container className="max-w-full overflow-x-hidden box-border">
          <h1 className="pb-1 pt-5.5 text-2xl font-extrabold tracking-tight text-primary">Checkout</h1>
          <div className="grid gap-6 pb-14 pt-3.5 min-[920px]:grid-cols-[1fr_360px] min-[920px]:items-start max-w-full overflow-x-hidden box-border">
            <div className="flex flex-col gap-4 max-w-full overflow-x-hidden box-border">
              <ContactStep
                email={email}
                onEmailChange={setEmail}
                emailOptIn={emailOptIn}
                onEmailOptInChange={setEmailOptIn}
                error={errors.email}
              />

              <DeliveryMethod value={deliveryMethod} onChange={setDeliveryMethod} subtotal={subtotal} />

              {deliveryMethod === "delivery" ? (
                <AddressForm
                  variant="delivery"
                  value={address}
                  onChange={setAddress}
                  errors={{
                    firstName: errors.firstName,
                    lastName: errors.lastName,
                    line1: errors.line1,
                    city: errors.city,
                    postalCode: errors.postalCode,
                    phone: errors.phone,
                  }}
                />
              ) : (
                <AddressForm
                  variant="pickup"
                  value={pickupContact}
                  onChange={setPickupContact}
                  errors={{ firstName: errors.firstName, lastName: errors.lastName, phone: errors.phone }}
                />
              )}

              <PaymentForm
                ref={paymentRef}
                billingSameAsDelivery={billingSameAsDelivery}
                onBillingSameAsDeliveryChange={setBillingSameAsDelivery}
              />

              {paymentError && (
                <ErrorBanner message={paymentError} onRetry={() => setPaymentError(null)} />
              )}
            </div>

            <aside className="rounded-xl border border-border bg-surface p-4.5 shadow-sm min-[920px]:sticky min-[920px]:top-20">
              <h2 className="mb-3.5 text-base font-bold text-primary">Order summary</h2>

              <ul className="mb-3.5 flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item.productId} className="flex justify-between gap-2 text-[13px]">
                    <span className="min-w-0 flex-1 truncate text-secondary">
                      {item.name} <span className="text-tertiary">×{item.quantity}</span>
                    </span>
                    <span className="shrink-0 font-mono font-semibold text-primary">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

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
                  <dt>{deliveryMethod === "pickup" ? "Pickup" : "Delivery"}</dt>
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
                disabled={hasUnavailableItem || authLoading}
                loading={submitting}
                onClick={handlePay}
              >
                Pay {formatCurrency(total)}
              </Button>

              <p className="mt-3.5 flex items-center justify-center gap-1.5 text-[11.5px] text-tertiary">
                <ShieldCheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Secured by Stripe · your card is never stored by us
              </p>
            </aside>
          </div>
        </Container>
      </main>
    </>
  );
}
