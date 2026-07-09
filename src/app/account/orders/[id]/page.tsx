"use client";

import { useToast } from "@/components/ui/Toast";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { OrderStatusStepper } from "@/components/commerce/OrderStatusStepper";
import { TruckIcon } from "@/components/ui/icons";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/currency";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  getOrderStatusLabel,
  mapApiOrderToAccountOrder,
  type ApiOrder,
  type CheckoutOrder,
} from "@/lib/checkout";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: orderId } = use(params);
  const toast = useToast();
  const { user } = useAuth();
  const [order, setOrder] = useState<CheckoutOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = (await res.json()) as ApiOrder[];
        const found = data.find((o) => o.number === orderId);
        setOrder(found ? mapApiOrderToAccountOrder(found, user?.email ?? "") : null);
      } catch {
        setError("Could not load order details.");
        toast.show("Could not load order details.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, toast, user?.email, reloadKey]);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-full overflow-x-hidden box-border space-y-6 px-4">
        <div className="h-6 w-1/4 bg-surface-2 rounded animate-pulse" />
        <Card className="p-4 sm:p-8 space-y-6">
          <div className="h-6 w-1/3 bg-surface-2 rounded animate-pulse" />
          <div className="h-10 bg-surface-2 rounded animate-pulse" />
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="h-20 bg-surface-2 rounded animate-pulse" />
            <div className="h-20 bg-surface-2 rounded animate-pulse" />
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-full overflow-x-hidden box-border space-y-6 px-4">
        <ErrorBanner message={error} onRetry={() => setReloadKey((k) => k + 1)} />
      </div>
    );
  }

  if (!order) {
    return (
      <EmptyState
        icon={<TruckIcon className="h-6 w-6" />}
        title="Order not found"
        description={`We couldn't find an order with the ID: ${orderId}`}
        action={
          <Button as="a" href="/account/orders">
            Back to Orders
          </Button>
        }
        className="py-12"
      />
    );
  }

  const statusConfig = getOrderStatusLabel(order.rawStatus ?? order.status);

  return (
    <div className="max-w-full overflow-x-hidden box-border space-y-6 px-4">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
          { label: "Orders", href: "/account/orders" },
          { label: order.orderNumber, href: `/account/orders/${order.orderNumber}` },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-primary">
            Order Details
          </h1>
          <p className="text-[13px] text-secondary">
            Placed on {formatDate(order.placedAt)}
          </p>
        </div>
        <Link href="/account/orders" className="text-[13px] font-semibold text-accent hover:text-accent-hover">
          ← Back to all orders
        </Link>
      </div>

      {/* Status Card with Stepper */}
      <Card className="p-4 sm:p-5 border border-border">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-secondary">
            Delivery Status Tracker
          </h2>
          <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
        </div>
        <div className="py-2">
          <OrderStatusStepper
            status={order.status}
            deliveryMethod={order.deliveryMethod}
          />
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Items and Shipping details */}
        <div className="space-y-6 lg:col-span-2">

          {/* Order Items */}
          <Card header={<h2 className="text-base font-bold text-primary">Order Items</h2>}>
            <div className="divide-y divide-border">
              {order.items.map((item) => (
                <div key={item.productId} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-border bg-white p-1 text-secondary">
                    <TruckIcon className="h-6 w-6 text-tertiary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[13.5px] font-bold text-primary truncate hover:text-accent">
                      {item.slug ? (
                        <Link href={`/products/${item.slug}`}>{item.name}</Link>
                      ) : (
                        item.name
                      )}
                    </h3>
                    <p className="text-xs text-secondary mt-0.5">
                      Quantity: {item.quantity} · {formatCurrency(item.unitPrice)} each
                    </p>
                  </div>
                  <div className="text-end">
                    <p className="text-[13.5px] font-bold font-mono text-primary">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Delivery Method and Contact Info */}
          <Card header={<h2 className="text-base font-bold text-primary">Fulfillment Details</h2>}>
            <div className="grid gap-6 sm:grid-cols-2">

              <div>
                <h3 className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                  Fulfillment Method
                </h3>
                <p className="text-[13.5px] font-semibold text-primary">
                  {order.deliveryMethod === "pickup" ? "In-Store Pickup" : "Local Home Delivery"}
                </p>
                <p className="text-xs text-secondary mt-1">
                  {order.deliveryMethod === "pickup"
                    ? "DevOps Target Main Shop (Ready in ~2 hrs)"
                    : "Delivered to your home address"}
                </p>
              </div>

              <div>
                {order.deliveryMethod === "pickup" ? (
                  <>
                    <h3 className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                      Pickup Contact
                    </h3>
                    {order.pickupContact ? (
                      <>
                        <p className="text-[13.5px] font-bold text-primary">
                          {order.pickupContact.firstName} {order.pickupContact.lastName}
                        </p>
                        <p className="text-xs font-mono text-secondary mt-1">
                          {order.pickupContact.phone}
                        </p>
                      </>
                    ) : (
                      <p className="text-xs text-secondary">
                        Contact details on file with your account.
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <h3 className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                      Shipping Address
                    </h3>
                    {order.address ? (
                      <>
                        <p className="text-[13.5px] font-bold text-primary">
                          {order.address.firstName} {order.address.lastName}
                        </p>
                        <p className="text-[13px] text-secondary mt-0.5 leading-relaxed">
                          {order.address.line1}
                          <br />
                          {order.address.city}, {order.address.postalCode}
                        </p>
                        <p className="text-xs font-mono text-secondary mt-1">
                          {order.address.phone}
                        </p>
                      </>
                    ) : (
                      <p className="text-xs text-secondary">No address on file for this order.</p>
                    )}
                  </>
                )}
              </div>

            </div>
          </Card>

        </div>

        {/* Right Column: Receipt summary */}
        <div>
          <Card header={<h2 className="text-base font-bold text-primary">Payment Receipt</h2>}>
            <div className="space-y-3">
              <div className="flex justify-between text-[13px] text-secondary">
                <span>Subtotal</span>
                <span className="font-mono">{formatCurrency(order.subtotal)}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-[13px] text-success">
                  <span>Discount {order.promoCode && `(${order.promoCode})`}</span>
                  <span className="font-mono">-{formatCurrency(order.discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-[13px] text-secondary">
                <span>Shipping / Delivery</span>
                <span className="font-mono">
                  {order.deliveryFee === 0 ? "FREE" : formatCurrency(order.deliveryFee)}
                </span>
              </div>

              <div className="flex justify-between text-[13px] text-secondary">
                <span>Sales Tax</span>
                <span className="font-mono">{formatCurrency(order.tax)}</span>
              </div>

              <div className="border-t border-border pt-3 flex justify-between text-[15px] font-extrabold text-primary">
                <span>Total Paid</span>
                <span className="font-mono text-accent">{formatCurrency(order.total)}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <Button onClick={() => window.print()} variant="secondary" fullWidth size="sm">
                Print Invoice
              </Button>
              <Button as="a" href="/support" variant="ghost" fullWidth size="sm">
                Get Support for Order
              </Button>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
