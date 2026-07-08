"use client";

import Link from "next/link";
import { useCart } from "@/components/commerce/CartProvider";
import { iconButtonClassName } from "@/components/ui/IconButton";
import { CartIcon } from "@/components/ui/icons";

export function CartButton() {
  const { count } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
      className={iconButtonClassName()}
    >
      <CartIcon className="h-[19px] w-[19px]" aria-hidden="true" />
      {count > 0 && (
        <span className="absolute top-1 end-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 font-mono text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
