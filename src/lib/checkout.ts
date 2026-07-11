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
  // Django's raw status string (see ApiOrder), kept alongside the coarse `status`
  // above so order-history views can show the full customer-facing vocabulary
  // (see getOrderStatusLabel) while the stepper keeps using the 4-stage version.
  rawStatus?: string;
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

// Publishable key is safe to expose client-side by design — never put a secret key here.
// When unset, /checkout falls back to a demo card form + simulated confirm so the flow
// stays testable without a Stripe account (see PaymentForm.tsx and the intent-skip logic
// in checkout/page.tsx).
export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

export interface PaymentResult {
  ok: boolean;
  message?: string;
}

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

// Shape returned by Django's OrderItemSerializer — nested under ApiOrder.items.
// Decimal fields come back as strings (DRF's default DecimalField behavior).
export interface ApiOrderItem {
  id: number;
  product: string | null;
  name: string;
  sku: string;
  unit_price: string;
  quantity: number;
  line_total: string;
}

// Shape of Order.shipping_address (a JSONField) — empty object for pickup orders.
export interface ApiShippingAddress {
  full_name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  postal_code?: string;
  phone?: string;
}

// Shape returned by Django's OrderSerializer (GET/POST /api/orders/ via the Next proxy).
// Decimal fields come back as strings (DRF's default DecimalField behavior).
export interface ApiOrder {
  id: number;
  number: string;
  status: string;
  fulfillment: CheckoutDeliveryMethod;
  shipping_address: ApiShippingAddress;
  subtotal: string;
  discount: string;
  delivery_fee: string;
  tax: string;
  total: string;
  promo_code: string;
  items: ApiOrderItem[];
  created_at: string;
}

const API_ORDER_STATUS_MAP: Record<string, OrderStatus> = {
  pending: "placed",
  pending_payment: "placed",
  awaiting_verification: "placed",
  paid: "paid",
  preparing: "fulfilling",
  ready: "fulfilling",
  shipped: "fulfilling",
  delivered: "completed",
  failed: "placed",
  cancelled: "placed",
  refunded: "placed",
};

export function mapApiOrderStatus(status: string): OrderStatus {
  return API_ORDER_STATUS_MAP[status] ?? "placed";
}

export type OrderStatusBadgeVariant = "neutral" | "accent" | "success" | "warning" | "danger" | "info";

// Django's full order-status vocabulary (api/backend shop/models.py: ORDER_STATUS_CHOICES),
// mapped to customer-facing copy. Broader than the 4-stage OrderStatus above, which only
// exists to drive the OrderStatusStepper's progress bar.
const ORDER_STATUS_LABELS: Record<string, { variant: OrderStatusBadgeVariant; label: string }> = {
  pending: { variant: "info", label: "Processing" },
  pending_payment: { variant: "warning", label: "Awaiting Payment" },
  awaiting_verification: { variant: "warning", label: "در انتظار تأیید" },
  paid: { variant: "info", label: "Paid" },
  failed: { variant: "danger", label: "Payment Failed" },
  preparing: { variant: "warning", label: "Preparing" },
  ready: { variant: "warning", label: "Ready" },
  shipped: { variant: "warning", label: "Shipped" },
  delivered: { variant: "success", label: "Delivered" },
  cancelled: { variant: "danger", label: "Cancelled" },
  refunded: { variant: "neutral", label: "Refunded" },
};

export function getOrderStatusLabel(status: string): { variant: OrderStatusBadgeVariant; label: string } {
  return ORDER_STATUS_LABELS[status] ?? { variant: "neutral", label: status };
}

// Builds the local CheckoutOrder shape the confirmation UI already renders,
// using the server-computed totals/status from the real order plus the
// client-side cart/contact details captured just before the cart was cleared.
export function mapApiOrderToCheckoutOrder(
  apiOrder: ApiOrder,
  context: {
    email: string;
    deliveryMethod: CheckoutDeliveryMethod;
    address?: CheckoutAddress;
    pickupContact?: PickupContact;
    items: CartItem[];
  },
): CheckoutOrder {
  return {
    orderNumber: apiOrder.number,
    placedAt: apiOrder.created_at,
    email: context.email,
    deliveryMethod: context.deliveryMethod,
    address: context.deliveryMethod === "delivery" ? context.address : undefined,
    pickupContact: context.deliveryMethod === "pickup" ? context.pickupContact : undefined,
    items: context.items,
    subtotal: Number(apiOrder.subtotal),
    discount: Number(apiOrder.discount),
    promoCode: apiOrder.promo_code || undefined,
    deliveryFee: Number(apiOrder.delivery_fee),
    tax: Number(apiOrder.tax),
    total: Number(apiOrder.total),
    status: mapApiOrderStatus(apiOrder.status),
    rawStatus: apiOrder.status,
  };
}

function splitFullName(fullName?: string): { firstName: string; lastName: string } {
  const trimmed = (fullName ?? "").trim();
  if (!trimmed) return { firstName: "", lastName: "" };
  const [firstName, ...rest] = trimmed.split(/\s+/);
  return { firstName, lastName: rest.join(" ") };
}

export function mapApiShippingAddressToCheckoutAddress(
  address: ApiShippingAddress | undefined,
): CheckoutAddress | undefined {
  if (!address || !address.line1) return undefined;
  const { firstName, lastName } = splitFullName(address.full_name);
  return {
    firstName,
    lastName,
    line1: address.line1,
    city: address.city ?? "",
    postalCode: address.postal_code ?? "",
    phone: address.phone ?? "",
  };
}

export function mapApiOrderItemsToCartItems(items: ApiOrderItem[]): CartItem[] {
  return items.map((item) => ({
    productId: String(item.id),
    slug: item.product ?? "",
    name: item.name,
    spec: item.sku,
    unitPrice: Number(item.unit_price),
    quantity: item.quantity,
    maxStock: item.quantity,
    stock: "in-stock",
  }));
}

// Self-contained mapper for order-history views (list/detail pages): unlike
// mapApiOrderToCheckoutOrder above, it doesn't need client-side cart/contact context
// captured at purchase time — it reads items and the shipping address straight off
// the API order. Django has no separate pickup-contact record, so pickupContact is
// always omitted for pickup orders.
export function mapApiOrderToAccountOrder(apiOrder: ApiOrder, email: string): CheckoutOrder {
  return {
    orderNumber: apiOrder.number,
    placedAt: apiOrder.created_at,
    email,
    deliveryMethod: apiOrder.fulfillment,
    address:
      apiOrder.fulfillment === "delivery"
        ? mapApiShippingAddressToCheckoutAddress(apiOrder.shipping_address)
        : undefined,
    items: mapApiOrderItemsToCartItems(apiOrder.items),
    subtotal: Number(apiOrder.subtotal),
    discount: Number(apiOrder.discount),
    promoCode: apiOrder.promo_code || undefined,
    deliveryFee: Number(apiOrder.delivery_fee),
    tax: Number(apiOrder.tax),
    total: Number(apiOrder.total),
    status: mapApiOrderStatus(apiOrder.status),
    rawStatus: apiOrder.status,
  };
}

// Flattens a DRF error payload (per-field arrays/strings, or `detail`) into a
// single message for the checkout page's error banner.
export function extractOrderErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  for (const value of Object.values(payload as Record<string, unknown>)) {
    const message = Array.isArray(value) ? value[0] : typeof value === "string" ? value : undefined;
    if (typeof message === "string" && message) return message;
  }
  return null;
}
