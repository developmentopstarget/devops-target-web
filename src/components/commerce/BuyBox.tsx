"use client";

import Link from "next/link";
import { useState } from "react";
import { ReturnIcon, ShieldCheckIcon, StarIcon, TruckIcon } from "@/components/ui/icons";
import { PriceTag } from "@/components/commerce/PriceTag";
import { BuyBoxActions } from "@/components/commerce/BuyBoxActions";
import { Button } from "@/components/ui/Button";
import { QuoteRequestModal } from "@/components/commerce/QuoteRequestModal";
import { storeConfig } from "@/config/store";
import type { Product } from "@/data/products";
import type { ProductDetail } from "@/data/product-details";
import { useLanguage } from "@/lib/useLanguage";

export interface BuyBoxProps {
  product: Product;
  detail: ProductDetail;
}

export function BuyBox({ product, detail }: BuyBoxProps) {
  const { t, lang } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stockCopy = {
    "in-stock": {
      label: lang === "fa" 
        ? `${t("inStock")} در ${storeConfig.city}`
        : `In stock — ready for same-day pickup in ${storeConfig.city}`,
      dot: "bg-success",
      text: "text-success",
    },
    "low-stock": {
      label: lang === "fa"
        ? "موجودی کم — برای تضمین تحویل حضوری در همان روز زودتر سفارش دهید"
        : "Low stock — order soon to guarantee same-day pickup",
      dot: "bg-warning",
      text: "text-warning",
    },
    "out-of-stock": {
      label: lang === "fa"
        ? "ناموجود — به لیست انتظار بپیوندید تا مطلع شوید"
        : "Out of stock — join the waitlist to be notified",
      dot: "bg-danger",
      text: "text-danger",
    },
  };

  const stock = stockCopy[product.stock];
  const save = product.compareAtPrice !== undefined ? product.compareAtPrice - product.price : undefined;
  const rounded = Math.round(product.rating);

  return (
    <div>
      {product.brand && (
        <p className="text-[12.5px] font-semibold uppercase tracking-wide text-accent">{product.brand}</p>
      )}
      <h1 className="mb-2.5 mt-1.5 text-2xl font-extrabold leading-tight tracking-tight text-primary">
        {product.name}
      </h1>

      <div className="mb-4 flex flex-wrap items-center gap-2 text-[13px] text-secondary">
        <span className="flex text-warning" aria-hidden="true">
          {Array.from({ length: 5 }, (_, i) => (
            <StarIcon key={i} className={`h-3.75 w-3.75 ${i < rounded ? "" : "opacity-25"}`} />
          ))}
        </span>
        <span>{product.rating.toFixed(1)}</span>
        <span aria-hidden="true">·</span>
        <Link href="#reviews" className="font-semibold text-accent hover:text-accent-hover">
          {lang === "fa" ? `${product.reviewCount} نظر` : `${product.reviewCount} reviews`}
        </Link>
        <span aria-hidden="true">·</span>
        <span className="font-mono">{lang === "fa" ? `شناسه کالا ${detail.sku}` : `SKU ${detail.sku}`}</span>
      </div>

      {product.pricing_mode === "on_request" ? (
        <div className="mb-4 text-lg font-bold text-accent">
          {lang === "fa" ? "قیمت بر اساس درخواست" : "Price on Request"}
        </div>
      ) : (
        <>
          <div className="mb-1.5 flex flex-wrap items-baseline gap-3">
            <PriceTag amount={product.price} compareAt={product.compareAtPrice} size="lg" />
            {save !== undefined && save > 0 && (
              <span className="rounded-[7px] bg-success/15 px-2.25 py-1 text-xs font-bold text-success">
                {lang === "fa" ? `ذخیره ${save} دلار` : `Save $${save}`}
              </span>
            )}
          </div>
          <p className="mb-4 text-xs text-tertiary">
            {lang === "fa" 
              ? `قیمت با احتساب مالیات · ارسال رایگان محلی برای خریدهای بالای ${storeConfig.freeDeliveryThreshold} دلار`
              : `Price incl. tax · Free local delivery over $${storeConfig.freeDeliveryThreshold}`}
          </p>
        </>
      )}

      <div className={["mb-4.5 flex items-center gap-2 text-[13px] font-semibold", stock.text].join(" ")}>
        <span className={["h-2 w-2 rounded-full", stock.dot].join(" ")} aria-hidden="true" />
        {stock.label}
      </div>

      {product.pricing_mode === "on_request" ? (
        <div className="mb-4.5">
          <Button
            type="button"
            fullWidth
            size="lg"
            onClick={() => setIsModalOpen(true)}
            className="text-base font-bold"
          >
            {lang === "fa" ? "تماس بگیرید" : "Request a quote"}
          </Button>
        </div>
      ) : (
        <BuyBoxActions product={product} />
      )}

      <ul className="mt-4.5 flex flex-col gap-2.75 rounded-xl border border-border bg-surface p-4">
        <li className="flex gap-2.5 text-[13px] text-secondary">
          <TruckIcon className="mt-0.5 h-[17px] w-[17px] shrink-0 text-accent" aria-hidden="true" />
          <span>
            {t("pickupWarrantyInfo")}
          </span>
        </li>
        <li className="flex gap-2.5 text-[13px] text-secondary">
          <ShieldCheckIcon className="mt-0.5 h-[17px] w-[17px] shrink-0 text-accent" aria-hidden="true" />
          <span>
            {t("localWarranty")}
          </span>
        </li>
        <li className="flex gap-2.5 text-[13px] text-secondary">
          <ReturnIcon className="mt-0.5 h-[17px] w-[17px] shrink-0 text-accent" aria-hidden="true" />
          <span>
            {t("returnPolicy")}
          </span>
        </li>
      </ul>

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

