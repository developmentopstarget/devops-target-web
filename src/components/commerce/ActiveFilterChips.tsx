import Link from "next/link";
import { CloseIcon } from "@/components/ui/icons";
import { clearedFilterPatch, formatStorage, hrefWithPatch, toggleArrayValue, type ParsedFilters } from "@/lib/products-filter";

export interface ActiveFilterChipsProps {
  pathname: string;
  filters: ParsedFilters;
  categoryLabels: Record<string, string>;
  className?: string;
}

interface Chip {
  key: string;
  label: string;
  href: string;
}

export function ActiveFilterChips({ pathname, filters, categoryLabels, className }: ActiveFilterChipsProps) {
  const chips: Chip[] = [];

  filters.category.forEach((slug) => {
    chips.push({
      key: `category-${slug}`,
      label: categoryLabels[slug] ?? slug,
      href: hrefWithPatch(pathname, filters, { category: toggleArrayValue(filters.category, slug) }),
    });
  });
  filters.brand.forEach((brand) => {
    chips.push({
      key: `brand-${brand}`,
      label: brand,
      href: hrefWithPatch(pathname, filters, { brand: toggleArrayValue(filters.brand, brand) }),
    });
  });
  filters.ram.forEach((gb) => {
    chips.push({
      key: `ram-${gb}`,
      label: `${gb}GB RAM`,
      href: hrefWithPatch(pathname, filters, { ram: toggleArrayValue(filters.ram, gb) }),
    });
  });
  filters.storage.forEach((gb) => {
    chips.push({
      key: `storage-${gb}`,
      label: `${formatStorage(gb)} storage`,
      href: hrefWithPatch(pathname, filters, { storage: toggleArrayValue(filters.storage, gb) }),
    });
  });
  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    const label = `$${filters.priceMin ?? 0}–${filters.priceMax !== undefined ? `$${filters.priceMax}` : "+"}`;
    chips.push({
      key: "price",
      label,
      href: hrefWithPatch(pathname, filters, { priceMin: undefined, priceMax: undefined }),
    });
  }
  if (filters.minRating !== undefined) {
    chips.push({
      key: "rating",
      label: `${filters.minRating}★ & up`,
      href: hrefWithPatch(pathname, filters, { minRating: undefined }),
    });
  }
  if (filters.inStockOnly) {
    chips.push({
      key: "in-stock",
      label: "In stock only",
      href: hrefWithPatch(pathname, filters, { inStockOnly: false }),
    });
  }

  const wrapperClassName = ["flex flex-wrap items-center gap-2", className ?? ""].filter(Boolean).join(" ");

  if (chips.length === 0) {
    return <div className={wrapperClassName} />;
  }

  const clearHref = hrefWithPatch(pathname, filters, clearedFilterPatch());

  return (
    <div className={wrapperClassName}>
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft py-1.25 ps-3 pe-1.5 text-xs font-semibold text-accent"
        >
          {chip.label}
          <Link
            href={chip.href}
            aria-label={`Remove ${chip.label} filter`}
            className="grid h-4 w-4 place-items-center rounded-full hover:bg-accent/20"
          >
            <CloseIcon className="h-2.75 w-2.75" aria-hidden="true" />
          </Link>
        </span>
      ))}
      <Link href={clearHref} className="text-xs font-semibold text-tertiary hover:text-danger">
        Clear all
      </Link>
    </div>
  );
}
