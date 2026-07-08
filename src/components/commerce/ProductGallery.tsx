"use client";

import { useState, type ReactElement } from "react";
import { Badge } from "@/components/ui/Badge";
import { categoryIcons, ComponentsIcon, DesktopIcon, MonitorIcon, type IconProps } from "@/components/ui/icons";
import { categories } from "@/data/categories";
import type { Product } from "@/data/products";

export interface ProductGalleryProps {
  product: Product;
  className?: string;
}

type IconComponent = (props: IconProps) => ReactElement;

interface GalleryImage {
  key: string;
  icon: IconComponent;
  label: string;
}

// Placeholder gallery views — swap for real product photography once the
// Django API serves an images[] array. Mirrors the mockup's arbitrary
// device-icon thumbnails (decorative, not literal per-angle photos).
function buildGalleryImages(product: Product): GalleryImage[] {
  const mainIconKey = categories.find((c) => c.slug === product.category)?.icon;
  const mainIcon = mainIconKey ? categoryIcons[mainIconKey] : ComponentsIcon;
  const supporting: IconComponent[] = [ComponentsIcon, MonitorIcon, DesktopIcon];

  return [
    { key: "main", icon: mainIcon, label: `${product.name} — front view` },
    ...supporting.map((icon, i) => ({ key: `alt-${i}`, icon, label: `${product.name} — view ${i + 2}` })),
  ];
}

export function ProductGallery({ product, className }: ProductGalleryProps) {
  const images = buildGalleryImages(product);
  const [selected, setSelected] = useState(0);
  const Active = images[selected].icon;
  const outOfStock = product.stock === "out-of-stock";

  return (
    <div className={["flex flex-col gap-3 lg:sticky lg:top-19", className ?? ""].filter(Boolean).join(" ")}>
      <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl border border-border bg-surface-2 bg-[radial-gradient(120%_120%_at_30%_10%,var(--accent-soft),transparent_60%)]">
        {product.badge && (
          <Badge variant={product.badge === "sale" ? "danger" : "accent"} className="absolute top-3.5 start-3.5">
            {product.badge === "sale" ? "Sale" : "New"}
          </Badge>
        )}
        <Active
          className={[
            "h-24 w-24 text-border-strong transition-transform duration-300 hover:scale-105",
            outOfStock ? "opacity-40 grayscale" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-hidden="true"
        />
      </div>
      <div className="flex gap-2.5">
        {images.map((img, i) => {
          const Icon = img.icon;
          const isSelected = i === selected;
          return (
            <button
              key={img.key}
              type="button"
              aria-label={`Show ${img.label}`}
              aria-pressed={isSelected}
              onClick={() => setSelected(i)}
              className={[
                "grid h-18 w-18 shrink-0 place-items-center rounded-[10px] border bg-surface-2 text-border-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                isSelected ? "border-accent ring-1 ring-accent" : "border-border hover:border-border-strong",
              ].join(" ")}
            >
              <Icon className="h-7.5 w-7.5" aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
