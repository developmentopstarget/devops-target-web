"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CartIcon } from "@/components/ui/icons";
import { QtyStepper } from "@/components/commerce/QtyStepper";
import { WishlistButton } from "@/components/commerce/WishlistButton";
import { maxQuantityForStock, useCart } from "@/components/commerce/CartProvider";
import { useToast } from "@/components/ui/Toast";
import type { Product } from "@/data/products";
import { useLanguage } from "@/lib/useLanguage";

export interface BuyBoxActionsProps {
  product: Product;
}

export function BuyBoxActions({ product }: BuyBoxActionsProps) {
  const { addItem } = useCart();
  const { show } = useToast();
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const outOfStock = product.stock === "out-of-stock";
  const maxQty = maxQuantityForStock(product.stock);

  function handleAddToCart() {
    setAdding(true);
    addItem(product, qty);
    const toastMsg = lang === "fa"
      ? `تعداد ${qty} عدد "${product.name}" به سبد خرید اضافه شد`
      : `Added ${qty} × "${product.name}" to cart`;
    show(toastMsg, "success");
    window.setTimeout(() => setAdding(false), 600);
  }

  function handleBuyNow() {
    addItem(product, qty);
    router.push("/cart");
  }

  return (
    <div className="mb-4.5">
      <div className="mb-3.5 flex items-center gap-3.5">
        <span className="text-[13px] font-semibold text-secondary">{t("quantity")}</span>
        <QtyStepper value={qty} min={1} max={outOfStock ? 1 : maxQty} onChange={setQty} disabled={outOfStock} />
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex gap-2.5">
          <Button
            type="button"
            fullWidth
            iconStart={<CartIcon className="h-4 w-4" aria-hidden="true" />}
            disabled={outOfStock}
            loading={adding}
            onClick={handleAddToCart}
          >
            {outOfStock ? (lang === "fa" ? "مطلعم کن" : "Notify me") : t("addToCart")}
          </Button>
          <WishlistButton productName={product.name} />
        </div>
        <Button type="button" variant="secondary" fullWidth disabled={outOfStock} onClick={handleBuyNow}>
          {t("buyNow")}
        </Button>
      </div>
    </div>
  );
}
