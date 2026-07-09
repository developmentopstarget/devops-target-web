"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/commerce/CartProvider";
import { useToast } from "@/components/ui/Toast";
import type { Product } from "@/data/products";

export interface AddToCartButtonProps {
  product: Product;
  disabled?: boolean;
  className?: string;
}

export function AddToCartButton({ product, disabled, className }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { show } = useToast();
  const [justAdded, setJustAdded] = useState(false);

  function handleClick() {
    addItem(product);
    show(`Added "${product.name}" to cart`, "success");
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
      {disabled ? "Notify me" : justAdded ? "Added" : "Add to cart"}
    </Button>
  );
}
