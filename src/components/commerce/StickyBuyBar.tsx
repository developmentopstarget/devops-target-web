"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { PriceTag } from "@/components/commerce/PriceTag";
import { useCart } from "@/components/commerce/CartProvider";
import { useToast } from "@/components/ui/Toast";
import type { Product } from "@/data/products";
import { useLanguage } from "@/lib/useLanguage";

export interface StickyBuyBarProps {
  product: Product;
}

export function StickyBuyBar({ product }: StickyBuyBarProps) {
  const { addItem } = useCart();
  const { show } = useToast();
  const { t, lang } = useLanguage();
  const [adding, setAdding] = useState(false);
  const outOfStock = product.stock === "out-of-stock";

  function handleAddToCart() {
    setAdding(true);
    addItem(product);
    show(lang === "fa" ? `"${product.name}" به سبد خرید اضافه شد` : `Added "${product.name}" to cart`, "success");
    window.setTimeout(() => setAdding(false), 600);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[45] flex items-center gap-3 border-t border-border bg-surface px-4 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] lg:hidden">
      <PriceTag amount={product.price} compareAt={product.compareAtPrice} size="lg" className="shrink-0" />
      <Button
        type="button"
        fullWidth
        disabled={outOfStock}
        loading={adding}
        onClick={handleAddToCart}
        className="flex-1"
      >
        {outOfStock ? (lang === "fa" ? "مطلعم کن" : "Notify me") : t("addToCart")}
      </Button>
    </div>
  );
}
