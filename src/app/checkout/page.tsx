"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { useLanguage } from "@/lib/useLanguage";
import {
  computeDeliveryFee,
  extractOrderErrorMessage,
  mapApiOrderToCheckoutOrder,
  saveOrder,
  TAX_RATE,
  type ApiOrder,
  type CheckoutAddress,
  type CheckoutDeliveryMethod,
  type PickupContact,
} from "@/lib/checkout";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emptyAddress: CheckoutAddress = { firstName: "", lastName: "", line1: "", city: "", postalCode: "", phone: "" };
const emptyPickupContact: PickupContact = { firstName: "", lastName: "", phone: "" };

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-bg">
          <div className="text-center space-y-4">
            <div className="h-10 w-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-secondary">Loading checkout...</p>
          </div>
        </div>
      }
    >
      <CheckoutPageContent />
    </Suspense>
  );
}

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("order_id");

  const { items, subtotal, clear } = useCart();
  const { show } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { lang } = useLanguage();
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

  // States for paying an existing order (from an approved quote)
  const [existingOrder, setExistingOrder] = useState<ApiOrder | null>(null);
  const [loadingExistingOrder, setLoadingExistingOrder] = useState(false);
  const [loadOrderError, setLoadOrderError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email);
    }
  }, [user, email]);

  // Redirect to login if unauthenticated on mount
  useEffect(() => {
    if (!authLoading && !user && mounted) {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    }
  }, [user, authLoading, router, mounted]);

  // Load existing order if orderIdParam is present
  useEffect(() => {
    if (!orderIdParam || !mounted) return;

    const fetchExistingOrder = async () => {
      setLoadingExistingOrder(true);
      setLoadOrderError(null);
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Failed to fetch");
        const orders = (await res.json()) as ApiOrder[];
        
        const found = orders.find(
          (o) => String(o.id) === orderIdParam || o.number === orderIdParam
        );

        if (found) {
          setExistingOrder(found);
          if (found.fulfillment) {
            setDeliveryMethod(found.fulfillment as CheckoutDeliveryMethod);
          }
        } else {
          setLoadOrderError(
            lang === "fa"
              ? "سفارش مورد نظر پیدا نشد."
              : `We couldn't find an order with the ID: ${orderIdParam}`
          );
        }
      } catch {
        setLoadOrderError(
          lang === "fa"
            ? "خطا در بارگذاری اطلاعات سفارش."
            : "Could not load order details."
        );
      } finally {
        setLoadingExistingOrder(false);
      }
    };

    fetchExistingOrder();
  }, [orderIdParam, mounted, lang]);

  useEffect(() => {
    if (mounted && !placingOrder && !orderIdParam && items.length === 0) {
      router.replace("/cart");
    }
  }, [mounted, items.length, placingOrder, router, orderIdParam]);

  if (!mounted || (items.length === 0 && !orderIdParam)) return null;

  if (loadingExistingOrder) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-secondary">
            {lang === "fa" ? "در حال بارگذاری اطلاعات سفارش..." : "Loading order details..."}
          </p>
        </div>
      </div>
    );
  }

  if (loadOrderError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg p-4">
        <div className="max-w-md w-full">
          <ErrorBanner message={loadOrderError} onRetry={() => window.location.reload()} />
        </div>
      </div>
    );
  }

  // Derive order details from existing order or the current cart
  const checkoutItems = existingOrder
    ? existingOrder.items.map((item) => ({
        productId: String(item.id),
        name: item.name,
        slug: item.product || "",
        spec: "",
        unitPrice: Number(item.unit_price),
        quantity: item.quantity,
        maxStock: 99,
        stock: "in-stock" as const,
      }))
    : items;

  const checkoutSubtotal = existingOrder ? Number(existingOrder.subtotal) : subtotal;
  const checkoutDiscount = existingOrder ? Number(existingOrder.discount) : (promo ? subtotal * promo.discountRate : 0);
  const checkoutDeliveryFee = existingOrder ? Number(existingOrder.delivery_fee) : computeDeliveryFee(deliveryMethod, subtotal);
  const checkoutTax = existingOrder ? Number(existingOrder.tax) : TAX_RATE * (subtotal - checkoutDiscount);
  const checkoutTotal = existingOrder ? Number(existingOrder.total) : subtotal - checkoutDiscount + checkoutDeliveryFee + checkoutTax;

  const hasUnavailableItem = !existingOrder && items.some((item) => item.stock === "out-of-stock");

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
      router.push(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      show("Please fix the highlighted fields.", "error");
      return;
    }

    const isPaymentValid = paymentRef.current?.validate();
    if (!isPaymentValid) {
      show("Please check payment details and try again.", "error");
      return;
    }

    setPaymentError(null);
    setSubmitting(true);
    let shouldResetSubmitting = true;

    try {
      let apiOrder: ApiOrder;

      if (existingOrder) {
        // Step 1 Skip: order already exists in Django
        apiOrder = existingOrder;
      } else {
        // Step 1: create the real order server-side.
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
          router.push(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
          return;
        }

        const orderData = await orderRes.json().catch(() => null);
        if (!orderRes.ok) {
          setPaymentError(extractOrderErrorMessage(orderData) ?? "Could not place your order. Please try again.");
          return;
        }

        apiOrder = orderData as ApiOrder;
      }

      // Step 2: confirm payment (Zarinpal initiate or manual bank transfer upload)
      const result = await paymentRef.current?.confirmPayment(undefined, apiOrder.id);

      if (!result?.ok) {
        setPaymentError(result?.message ?? "Payment failed. Please try again.");
        return;
      }

      // If selected method was Zarinpal, the user is being redirected to the payment url
      if (paymentRef.current?.paymentMethod === "zarinpal") {
        if (!existingOrder) {
          clear();
        }
        shouldResetSubmitting = false;
        return;
      }

      // For Bank Transfer, construct the localized CheckoutOrder
      const order = mapApiOrderToCheckoutOrder(
        {
          ...apiOrder,
          status: "awaiting_verification",
        },
        {
          email: email.trim(),
          deliveryMethod,
          address: deliveryMethod === "delivery" ? address : undefined,
          pickupContact: deliveryMethod === "pickup" ? pickupContact : undefined,
          items: checkoutItems,
        }
      );

      setPlacingOrder(true);
      saveOrder(order);
      
      // Only clear current shopping cart if this was NOT an existing quote payment
      if (!existingOrder) {
        clear();
      }

      router.push("/checkout/success");
    } catch (err) {
      console.error("Checkout failed:", err);
      setPaymentError(
        lang === "fa"
          ? "خطای غیرمنتظره در پرداخت."
          : "Unexpected error during checkout."
      );
    } finally {
      if (shouldResetSubmitting) {
        setSubmitting(false);
      }
    }
  }

  return (
    <>
      <CheckoutHeader />
      <main className="flex-1 overflow-x-hidden box-border">
        <Container className="lg:max-w-6xl overflow-x-hidden box-border">
          <h1 className="pb-1 pt-5.5 text-2xl font-extrabold tracking-tight text-primary">
            {existingOrder
              ? lang === "fa"
                ? "پرداخت درخواست قیمت"
                : "Quote Checkout"
              : lang === "fa"
              ? "تسویه حساب"
              : "Checkout"}
          </h1>
          <div className="grid gap-6 pb-14 pt-3.5 min-[920px]:grid-cols-[1fr_360px] min-[920px]:items-start max-w-full overflow-x-hidden box-border">
            <div className="flex flex-col gap-4 max-w-full overflow-x-hidden box-border">
              <ContactStep
                email={email}
                onEmailChange={setEmail}
                emailOptIn={emailOptIn}
                onEmailOptInChange={setEmailOptIn}
                error={errors.email}
              />

              {existingOrder ? (
                /* Locked Delivery Method for Quote payments */
                <div className="rounded-xl border border-border bg-surface p-4.5 shadow-sm">
                  <h3 className="mb-2 text-sm font-bold text-primary">
                    {lang === "fa" ? "روش تحویل" : "Delivery Method"}
                  </h3>
                  <p className="text-sm text-secondary">
                    {existingOrder.fulfillment === "pickup"
                      ? lang === "fa"
                        ? "تحویل حضوری (Springfield)"
                        : "In-store Pickup (Springfield)"
                      : lang === "fa"
                      ? "ارسال محلی"
                      : "Local Delivery"}
                  </p>
                </div>
              ) : (
                <DeliveryMethod value={deliveryMethod} onChange={setDeliveryMethod} subtotal={subtotal} />
              )}

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
              <h2 className="mb-3.5 text-base font-bold text-primary">
                {lang === "fa" ? "خلاصه سفارش" : "Order summary"}
              </h2>

              <ul className="mb-3.5 flex flex-col gap-2.5">
                {checkoutItems.map((item) => (
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

              {!existingOrder && (
                <PromoCode applied={promo} onApply={setPromo} onRemove={() => setPromo(null)} />
              )}

              {hasUnavailableItem && (
                <p className="mb-3 rounded-lg bg-danger/10 px-3 py-2 text-xs font-medium text-danger">
                  Remove out-of-stock items to check out.
                </p>
              )}

              <dl aria-live="polite">
                <div className="flex justify-between py-1.75 text-[13.5px] text-secondary">
                  <dt>{lang === "fa" ? "جمع جزئی" : "Subtotal"}</dt>
                  <dd className="font-mono font-semibold text-primary">{formatCurrency(checkoutSubtotal)}</dd>
                </div>
                {checkoutDiscount > 0 && (
                  <div className="flex justify-between py-1.75 text-[13.5px] text-secondary">
                    <dt>{lang === "fa" ? "تخفیف" : "Promo"}</dt>
                    <dd className="font-mono font-semibold text-success">−{formatCurrency(checkoutDiscount)}</dd>
                  </div>
                )}
                <div className="flex justify-between py-1.75 text-[13.5px] text-secondary">
                  <dt>
                    {deliveryMethod === "pickup"
                      ? lang === "fa"
                        ? "تحویل حضوری"
                        : "Pickup"
                      : lang === "fa"
                      ? "ارسال محلی"
                      : "Delivery"}
                  </dt>
                  <dd className={checkoutDeliveryFee === 0 ? "text-xs font-bold text-success" : "font-mono font-semibold text-primary"}>
                    {checkoutDeliveryFee === 0 ? (lang === "fa" ? "رایگان" : "FREE") : formatCurrency(checkoutDeliveryFee)}
                  </dd>
                </div>
                <div className="flex justify-between py-1.75 text-[13.5px] text-secondary">
                  <dt>{lang === "fa" ? "مالیات تخمینی" : "Estimated tax"}</dt>
                  <dd className="font-mono font-semibold text-primary">{formatCurrency(checkoutTax)}</dd>
                </div>
                <div className="mt-2 flex items-baseline justify-between border-t border-border pt-3.5 font-bold">
                  <dt className="text-[15px] text-primary">{lang === "fa" ? "جمع کل" : "Total"}</dt>
                  <dd className="font-mono text-[22px] tracking-tight text-primary">{formatCurrency(checkoutTotal)}</dd>
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
                {lang === "fa"
                  ? `پرداخت ${formatCurrency(checkoutTotal)}`
                  : `Pay ${formatCurrency(checkoutTotal)}`}
              </Button>

              <p className="mt-3.5 flex items-center justify-center gap-1.5 text-[11.5px] text-tertiary">
                <ShieldCheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                {lang === "fa"
                  ? "پرداخت امن و معتبر"
                  : "Secure and verified payment"}
              </p>
            </aside>
          </div>
        </Container>
      </main>
    </>
  );
}
