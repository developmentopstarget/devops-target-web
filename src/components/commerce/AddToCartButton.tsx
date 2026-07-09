"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/commerce/CartProvider";
import { useToast } from "@/components/ui/Toast";
import type { Product } from "@/data/products";
import { useLanguage } from "@/lib/useLanguage";

export interface AddToCartButtonProps {
  product: Product;
  disabled?: boolean;
  className?: string;
}

export function AddToCartButton({ product, disabled, className }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { show } = useToast();
  const { t, lang } = useLanguage();
  const [justAdded, setJustAdded] = useState(false);

  function handleClick() {
    addItem(product);
    show(lang === "fa" ? `"${product.name}" به سبد خرید اضافه شد` : `Added "${product.name}" to cart`, "success");
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <Button
      type="button"
      variant="primary"
      size="sm"
      fullWidth
      disabled={disabled}
      onClick={handleClick}
      className={className}
    >
      {disabled 
        ? (lang === "fa" ? "مطلعم کن" : "Notify me") 
        : justAdded 
          ? (lang === "fa" ? "اضافه شد" : "Added") 
          : t("addToCart")}
    </Button>
  );
}
