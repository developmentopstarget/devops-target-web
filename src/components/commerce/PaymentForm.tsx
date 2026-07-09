"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/Input";
import { CheckoutStepCard } from "@/components/commerce/CheckoutStepCard";
import { simulateCheckoutPayment, type PaymentResult } from "@/lib/checkout";

// Publishable keys are safe to expose client-side by design — never put a secret
// key here. Left unset until the Django backend + a real Stripe account exist;
// see the TODO in lib/checkout.ts for the server-side half of this integration.
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

export interface PaymentFormHandle {
  confirmPayment: () => Promise<PaymentResult>;
}

export interface PaymentFormProps {
  billingSameAsDelivery: boolean;
  onBillingSameAsDeliveryChange: (value: boolean) => void;
}

interface MockCardValue {
  cardNumber: string;
  expiry: string;
  cvc: string;
}

const emptyMockCard: MockCardValue = { cardNumber: "", expiry: "", cvc: "" };

function validateMockCard(value: MockCardValue) {
  const errors: Partial<Record<keyof MockCardValue, string>> = {};
  const digits = value.cardNumber.replace(/\s+/g, "");
  if (digits.length < 13 || digits.length > 19 || !/^\d+$/.test(digits)) {
    errors.cardNumber = "Enter a valid card number.";
  }
  if (!/^\d{2}\s*\/\s*\d{2}$/.test(value.expiry)) {
    errors.expiry = "MM / YY";
  }
  if (!/^\d{3,4}$/.test(value.cvc)) {
    errors.cvc = "3-4 digits";
  }
  return errors;
}

function elementStyle(isDark: boolean) {
  return {
    style: {
      base: {
        fontSize: "15px",
        fontFamily: "Inter, system-ui, sans-serif",
        color: isDark ? "#F1F5F9" : "#0F172A",
        "::placeholder": { color: isDark ? "#6B7688" : "#94A3B8" },
      },
      invalid: { color: isDark ? "#F87171" : "#DC2626" },
    },
  };
}

// Real Stripe Elements path — active once NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set.
const StripeFields = forwardRef<PaymentFormHandle>(function StripeFields(_props, ref) {
  const stripe = useStripe();
  const elements = useElements();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [complete, setComplete] = useState({ number: false, expiry: false, cvc: false });
  const [fieldError, setFieldError] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    async confirmPayment(): Promise<PaymentResult> {
      if (!stripe || !elements || !complete.number || !complete.expiry || !complete.cvc) {
        return { ok: false, message: "Enter complete card details." };
      }
      // TODO(stripe): call stripe.confirmCardPayment(clientSecret, { payment_method: { card: elements.getElement(CardNumberElement)! } })
      // once the backend PaymentIntent endpoint exists. For now, simulate success/decline.
      return simulateCheckoutPayment();
    },
  }));

  const style = elementStyle(isDark);

  return (
    <>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-primary">Card number</label>
        <div className="flex h-11 items-center rounded-[10px] border border-border-strong bg-bg px-3">
          <CardNumberElement
            options={style}
            onChange={(e) => {
              setComplete((c) => ({ ...c, number: e.complete }));
              setFieldError(e.error?.message ?? null);
            }}
            className="w-full"
          />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-primary">Expiry</label>
          <div className="flex h-11 items-center rounded-[10px] border border-border-strong bg-bg px-3">
            <CardExpiryElement
              options={style}
              onChange={(e) => {
                setComplete((c) => ({ ...c, expiry: e.complete }));
                setFieldError(e.error?.message ?? null);
              }}
              className="w-full"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-primary">CVC</label>
          <div className="flex h-11 items-center rounded-[10px] border border-border-strong bg-bg px-3">
            <CardCvcElement
              options={style}
              onChange={(e) => {
                setComplete((c) => ({ ...c, cvc: e.complete }));
                setFieldError(e.error?.message ?? null);
              }}
              className="w-full"
            />
          </div>
        </div>
      </div>
      {fieldError && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-danger">
          {fieldError}
        </p>
      )}
    </>
  );
});

// Fallback demo path used whenever no publishable key is configured — lets the
// checkout flow be exercised end-to-end without a live Stripe account.
const MockFields = forwardRef<PaymentFormHandle>(function MockFields(_props, ref) {
  const [value, setValue] = useState<MockCardValue>(emptyMockCard);
  const [errors, setErrors] = useState<Partial<Record<keyof MockCardValue, string>>>({});

  useImperativeHandle(ref, () => ({
    async confirmPayment(): Promise<PaymentResult> {
      const validationErrors = validateMockCard(value);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) {
        return { ok: false, message: "Check your card details and try again." };
      }
      return simulateCheckoutPayment(value.cardNumber);
    },
  }));

  return (
    <>
      <p className="mb-3 rounded-lg bg-info/10 px-3 py-2 text-xs font-medium text-info">
        Demo payment — no real charge is made. Use{" "}
        <span className="font-mono">4242 4242 4242 4242</span> to simulate success, or{" "}
        <span className="font-mono">4000 0000 0000 0002</span> to simulate a decline.
      </p>
      <Input
        label="Card number"
        placeholder="1234 5678 9012 3456"
        inputMode="numeric"
        autoComplete="cc-number"
        maxLength={23}
        required
        value={value.cardNumber}
        error={errors.cardNumber}
        onChange={(e) => setValue((v) => ({ ...v, cardNumber: e.target.value }))}
      />
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Input
          label="Expiry"
          placeholder="MM / YY"
          inputMode="numeric"
          autoComplete="cc-exp"
          required
          value={value.expiry}
          error={errors.expiry}
          onChange={(e) => setValue((v) => ({ ...v, expiry: e.target.value }))}
        />
        <Input
          label="CVC"
          placeholder="123"
          inputMode="numeric"
          autoComplete="cc-csc"
          maxLength={4}
          required
          value={value.cvc}
          error={errors.cvc}
          onChange={(e) => setValue((v) => ({ ...v, cvc: e.target.value }))}
        />
      </div>
    </>
  );
});

export const PaymentForm = forwardRef<PaymentFormHandle, PaymentFormProps>(function PaymentForm(
  { billingSameAsDelivery, onBillingSameAsDeliveryChange },
  ref,
) {
  const fieldsRef = useMemo(() => ({ current: null as PaymentFormHandle | null }), []);

  useImperativeHandle(ref, () => ({
    confirmPayment: () => {
      if (!fieldsRef.current) {
        return Promise.resolve({ ok: false, message: "Payment form isn't ready yet." });
      }
      return fieldsRef.current.confirmPayment();
    },
  }));

  return (
    <CheckoutStepCard step={4} title="Payment">
      {stripePromise ? (
        <Elements stripe={stripePromise}>
          <StripeFields ref={(handle) => { fieldsRef.current = handle; }} />
        </Elements>
      ) : (
        <MockFields ref={(handle) => { fieldsRef.current = handle; }} />
      )}
      <label className="mt-3 flex items-center gap-2.25 text-[13px] text-secondary">
        <input
          type="checkbox"
          checked={billingSameAsDelivery}
          onChange={(e) => onBillingSameAsDeliveryChange(e.target.checked)}
          className="h-4 w-4 accent-accent"
        />
        Billing address same as delivery
      </label>
    </CheckoutStepCard>
  );
});
