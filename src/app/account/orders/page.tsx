"use client";

import { useToast } from "@/components/ui/Toast";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { TruckIcon } from "@/components/ui/icons";
import { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/currency";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getOrderStatusLabel, mapApiOrderToAccountOrder, type ApiOrder, type CheckoutOrder } from "@/lib/checkout";

export default function OrdersPage() {
  const toast = useToast();
  const { user } = useAuth();
  const [orders, setOrders] = useState<CheckoutOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = (await res.json()) as ApiOrder[];
        setOrders(data.map((order) => mapApiOrderToAccountOrder(order, user?.email ?? "")));
      } catch {
        setError("Could not load your orders.");
        toast.show("Could not load your orders.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [toast, user?.email, reloadKey]);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-full overflow-x-hidden box-border space-y-6 px-4">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
          { label: "Orders", href: "/account/orders" },
        ]}
      />

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-primary">
          Order History
        </h1>
        <p className="text-[13px] text-secondary">
          Track and manage your online and in-store computer hardware orders.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i} className="p-5">
              <div className="flex items-center justify-between gap-4 border-b border-border pb-3 mb-4">
                <div className="h-5 w-24 bg-surface-2 rounded animate-pulse" />
                <div className="h-5 w-16 bg-surface-2 rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-surface-2 rounded animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/2 bg-surface-2 rounded animate-pulse" />
                  <div className="h-4 w-1/4 bg-surface-2 rounded animate-pulse" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <ErrorBanner message={error} onRetry={() => setReloadKey((k) => k + 1)} />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<TruckIcon className="h-6 w-6" />}
          title="No orders found"
          description="You haven't placed any orders yet."
          action={
            <Button as="a" href="/products">
              Start Shopping
            </Button>
          }
          className="py-12"
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusConfig = getOrderStatusLabel(order.rawStatus ?? order.status);
            const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <Card key={order.orderNumber} className="overflow-hidden border border-border">
                {/* Order Summary Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-surface-2 px-4 sm:px-5 py-3.5">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <div>
                      <p className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                        Order Number
                      </p>
                      <p className="text-[13.5px] font-bold font-mono text-primary">
                        {order.orderNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                        Date Placed
                      </p>
                      <p className="text-[13px] font-semibold text-primary">
                        {formatDate(order.placedAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                        Total Amount
                      </p>
                      <p className="text-[13.5px] font-bold font-mono text-accent">
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col gap-4">
                    {order.items.map((item) => (
                      <div key={item.productId} className="flex gap-4 items-center">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-border bg-white p-1 text-secondary">
                          {/* Fallback to simple icon since we might not have the actual image asset */}
                          <TruckIcon className="h-6 w-6 text-tertiary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-[13.5px] font-bold text-primary truncate hover:text-accent">
                            {item.slug ? (
                              <Link href={`/products/${item.slug}`}>{item.name}</Link>
                            ) : (
                              item.name
                            )}
                          </h4>
                          <p className="text-xs text-secondary mt-0.5">
                            Quantity: {item.quantity} · {formatCurrency(item.unitPrice)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-secondary">
                      {totalQty} item{totalQty === 1 ? "" : "s"} · {order.deliveryMethod === "pickup" ? "In-Store Pickup" : "Local Home Delivery"}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        as="a"
                        href={`/account/orders/${order.orderNumber}`}
                        variant="secondary"
                        size="sm"
                      >
                        View Order Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
