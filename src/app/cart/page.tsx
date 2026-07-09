"use client";

import Link from "next/link";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { CartIcon } from "@/components/ui/icons";
import { CartLineItem } from "@/components/commerce/CartLineItem";
import { OrderSummary } from "@/components/commerce/OrderSummary";
import { useCart } from "@/components/commerce/CartProvider";
import { storeConfig } from "@/config/store";

export default function CartPage() {
  const { items, subtotal, count, updateQty, removeItem } = useCart();

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Container>
          <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4.5 pt-5.5">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-primary">Your cart</h1>
              {items.length > 0 && (
                <p className="mt-1 text-[13px] text-secondary">
                  {count} item{count === 1 ? "" : "s"} · in {storeConfig.city} &amp; online
                </p>
              )}
            </div>
            <Link href="/products" className="text-[13px] font-semibold text-accent hover:text-accent-hover">
              ← Continue shopping
            </Link>
          </div>

          {items.length === 0 ? (
            <EmptyState
              icon={<CartIcon className="h-6 w-6" aria-hidden="true" />}
              title="Your cart is empty"
              description="Browse laptops, custom PCs, and components — add something to get started."
              action={
                <Button as="a" href="/products">
                  Start shopping
                </Button>
              }
              className="py-16"
            />
          ) : (
            <div className="grid gap-6 pb-14 min-[960px]:grid-cols-[1fr_340px] min-[960px]:items-start">
              <div className="flex flex-col gap-3">
                {items.map((item) => (
                  <CartLineItem
                    key={item.productId}
                    item={item}
                    onQtyChange={(qty) => updateQty(item.productId, qty)}
                    onRemove={() => removeItem(item.productId)}
                  />
                ))}
              </div>
              <OrderSummary items={items} subtotal={subtotal} />
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
