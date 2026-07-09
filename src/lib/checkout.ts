import { storeConfig } from "@/config/store";
import type { CartItem } from "@/components/commerce/CartProvider";

export type CheckoutDeliveryMethod = "pickup" | "delivery";

export interface CheckoutAddress {
  firstName: string;
  lastName: string;
  line1: string;
  city: string;
  postalCode: string;
  phone: string;
}

export interface PickupContact {
  firstName: string;
  lastName: string;
  phone: string;
}

export type OrderStatus = "placed" | "paid" | "fulfilling" | "completed";

export interface CheckoutOrder {
  orderNumber: string;
  placedAt: string;
  email: string;
  deliveryMethod: CheckoutDeliveryMethod;
  address?: CheckoutAddress;
  pickupContact?: PickupContact;
  items: CartItem[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  deliveryFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
}

// Placeholders — real rates/fees come from the Django API + tax service later.
// Kept in sync with the same constants OrderSummary uses for the cart estimate.
export const TAX_RATE = 0.08;
export const FLAT_DELIVERY_FEE = 9.99;
export const PICKUP_READY_ESTIMATE = "ready in ~2 hrs";

export function computeDeliveryFee(method: CheckoutDeliveryMethod, subtotal: number): number {
  if (method === "pickup") return 0;
  return subtotal >= storeConfig.freeDeliveryThreshold ? 0 : FLAT_DELIVERY_FEE;
}

export function generateOrderNumber(): string {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `DT-${rand}`;
}

// A well-known Stripe test card number for a generic decline — lets the demo
// exercise the payment-error/retry state without any real payment backend.
export const TEST_DECLINE_CARD_NUMBER = "4000000000000002";

export interface PaymentResult {
  ok: boolean;
  message?: string;
}

// TODO(stripe): replace this stub with a real call once the Django backend exposes
// POST /api/checkout/intent. Real flow: create a PaymentIntent server-side, confirm it
// with stripe.confirmCardPayment(clientSecret, {...}) here, then create the order from
// the confirmed intent instead of simulating success client-side.
export function simulateCheckoutPayment(cardNumberForDeclineCheck?: string): Promise<PaymentResult> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      if (cardNumberForDeclineCheck?.replace(/\s+/g, "") === TEST_DECLINE_CARD_NUMBER) {
        resolve({ ok: false, message: "Your card was declined. Please try a different payment method." });
        return;
      }
      resolve({ ok: true });
    }, 900);
  });
}

const ORDER_STORAGE_KEY = "devops-target:last-order";

export function saveOrder(order: CheckoutOrder) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
  } catch {
    // sessionStorage can fail (quota exceeded, private browsing) — success page
    // falls back to its own empty state if the order can't be read back.
  }
}

export function readOrder(): CheckoutOrder | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(ORDER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CheckoutOrder) : null;
  } catch {
    return null;
  }
}
