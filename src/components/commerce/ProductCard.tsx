"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { ComponentsIcon } from "@/components/ui/icons";
import { StockBadge } from "@/components/commerce/StockBadge";
import { PriceTag } from "@/components/commerce/PriceTag";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { Button } from "@/components/ui/Button";
import { QuoteRequestModal } from "@/components/commerce/QuoteRequestModal";
import type { Product } from "@/data/products";
import { useLanguage } from "@/lib/useLanguage";

export interface ProductCardProps {
  product: Product;
  href?: string;
}

export function ProductCard({ product, href }: ProductCardProps) {
  const outOfStock = product.stock === "out-of-stock";
  const link = href ?? `/products/${product.slug}`;
  const { t, lang } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <Link href={link} className="relative block aspect-square bg-surface-2" aria-label={product.name}>
        <div
          className={[
            "flex h-full w-full items-center justify-center bg-[radial-gradient(110%_110%_at_30%_10%,var(--accent-soft),transparent_60%)]",
            outOfStock ? "opacity-40 grayscale" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <ComponentsIcon className="h-12 w-12 text-border-strong" aria-hidden="true" />
        </div>
        {product.badge && (
          <Badge
            variant={product.badge === "sale" ? "danger" : "accent"}
            className="absolute top-2.5 start-2.5"
          >
            {product.badge === "sale" ? t("sale") : t("new")}
          </Badge>
        )}
        <StockBadge stock={product.stock} className="absolute bottom-2.5 start-2.5" />
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <Link href={link} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-primary">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-secondary">{product.spec}</p>
        <Rating value={product.rating} count={product.reviewCount} />
        {product.pricing_mode === "on_request" ? (
          <div className="mt-auto pt-1 flex flex-col gap-2">
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">
              {lang === "fa" ? "قیمت بر اساس درخواست" : "Price on Request"}
            </span>
            <Button
              type="button"
              fullWidth
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsModalOpen(true);
              }}
            >
              {lang === "fa" ? "تماس بگیرید" : "Request a quote"}
            </Button>
          </div>
        ) : (
          <>
            <PriceTag amount={product.price} compareAt={product.compareAtPrice} className="mt-auto pt-1" />
            <AddToCartButton product={product} disabled={outOfStock} className="mt-2" />
          </>
        )}
      </div>

      {isModalOpen && (
        <QuoteRequestModal
          product={product}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

