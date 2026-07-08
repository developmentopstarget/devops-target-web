"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StarIcon } from "@/components/ui/icons";
import {
  clearedFilterPatch,
  formatStorage,
  hrefWithPatch,
  toggleArrayValue,
  type ParsedFilters,
} from "@/lib/products-filter";

export interface FilterCategoryOption {
  slug: string;
  name: string;
  count: number;
}

export interface FilterBrandOption {
  name: string;
  count: number;
}

export interface FilterPanelProps {
  pathname: string;
  filters: ParsedFilters;
  categoryOptions: FilterCategoryOption[];
  brandOptions: FilterBrandOption[];
  ramOptions: number[];
  storageOptions: number[];
  showHeader?: boolean;
  className?: string;
}

const ratingOptions = [4, 3];

function pillClassName(active: boolean) {
  return [
    "rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition-colors",
    active
      ? "border-accent bg-accent-soft text-accent"
      : "border-border-strong bg-surface text-secondary hover:bg-surface-2",
  ].join(" ");
}

function optionRowClassName() {
  return "flex cursor-pointer items-center gap-2.25 py-1.25 text-[13px] text-secondary hover:text-primary";
}

export function FilterPanel({
  pathname,
  filters,
  categoryOptions,
  brandOptions,
  ramOptions,
  storageOptions,
  showHeader = true,
  className,
}: FilterPanelProps) {
  const router = useRouter();

  function go(patch: Partial<ParsedFilters>) {
    router.push(hrefWithPatch(pathname, filters, patch));
  }

  return (
    <div className={className}>
      {showHeader && (
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-primary">Filters</h2>
          <button
            type="button"
            onClick={() => go(clearedFilterPatch())}
            className="text-xs font-semibold text-accent hover:text-accent-hover"
          >
            Clear all
          </button>
        </div>
      )}

      <fieldset className="border-t border-border py-4 first:border-t-0 first:pt-0">
        <legend className="mb-2.75 text-[13px] font-bold text-primary">Category</legend>
        <div className="flex flex-col">
          {categoryOptions.map((opt) => (
            <label key={opt.slug} className={optionRowClassName()}>
              <input
                type="checkbox"
                checked={filters.category.includes(opt.slug)}
                onChange={() => go({ category: toggleArrayValue(filters.category, opt.slug) })}
                className="h-4 w-4 accent-accent"
              />
              {opt.name}
              <span className="ms-auto font-mono text-[11.5px] text-tertiary">{opt.count}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="border-t border-border py-4">
        <legend className="mb-2.75 text-[13px] font-bold text-primary">Price</legend>
        <PriceRangeInputs
          key={`${filters.priceMin ?? ""}-${filters.priceMax ?? ""}`}
          pathname={pathname}
          filters={filters}
        />
      </fieldset>

      {brandOptions.length > 0 && (
        <fieldset className="border-t border-border py-4">
          <legend className="mb-2.75 text-[13px] font-bold text-primary">Brand</legend>
          <div className="flex flex-col">
            {brandOptions.map((opt) => (
              <label key={opt.name} className={optionRowClassName()}>
                <input
                  type="checkbox"
                  checked={filters.brand.includes(opt.name)}
                  onChange={() => go({ brand: toggleArrayValue(filters.brand, opt.name) })}
                  className="h-4 w-4 accent-accent"
                />
                {opt.name}
                <span className="ms-auto font-mono text-[11.5px] text-tertiary">{opt.count}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {ramOptions.length > 0 && (
        <fieldset className="border-t border-border py-4">
          <legend className="mb-2.75 text-[13px] font-bold text-primary">RAM</legend>
          <div className="flex flex-wrap gap-1.75">
            {ramOptions.map((gb) => {
              const active = filters.ram.includes(gb);
              return (
                <button
                  key={gb}
                  type="button"
                  aria-pressed={active}
                  onClick={() => go({ ram: toggleArrayValue(filters.ram, gb) })}
                  className={pillClassName(active)}
                >
                  {gb}GB
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {storageOptions.length > 0 && (
        <fieldset className="border-t border-border py-4">
          <legend className="mb-2.75 text-[13px] font-bold text-primary">Storage</legend>
          <div className="flex flex-wrap gap-1.75">
            {storageOptions.map((gb) => {
              const active = filters.storage.includes(gb);
              return (
                <button
                  key={gb}
                  type="button"
                  aria-pressed={active}
                  onClick={() => go({ storage: toggleArrayValue(filters.storage, gb) })}
                  className={pillClassName(active)}
                >
                  {formatStorage(gb)}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      <fieldset className="border-t border-border py-4">
        <legend className="mb-2.75 text-[13px] font-bold text-primary">Rating</legend>
        <div className="flex flex-col">
          {ratingOptions.map((r) => (
            <label key={r} className={optionRowClassName()}>
              <input
                type="radio"
                name="minRating"
                checked={filters.minRating === r}
                onChange={() => go({ minRating: r })}
                className="h-4 w-4 accent-accent"
              />
              <span className="flex text-warning" aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon key={i} className={`h-3 w-3 ${i < r ? "" : "opacity-25"}`} />
                ))}
              </span>
              {r} &amp; up
            </label>
          ))}
        </div>
      </fieldset>

      <div className="border-t border-border pt-4">
        <label className="flex cursor-pointer items-center gap-2.25 text-[13px] font-semibold text-primary">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={() => go({ inStockOnly: !filters.inStockOnly })}
            className="h-4 w-4 accent-accent"
          />
          In stock only
        </label>
      </div>
    </div>
  );
}

function PriceRangeInputs({ pathname, filters }: { pathname: string; filters: ParsedFilters }) {
  const router = useRouter();
  const [min, setMin] = useState(filters.priceMin?.toString() ?? "");
  const [max, setMax] = useState(filters.priceMax?.toString() ?? "");

  function apply() {
    router.push(
      hrefWithPatch(pathname, filters, {
        priceMin: min ? Number(min) : undefined,
        priceMax: max ? Number(max) : undefined,
      }),
    );
  }

  const inputClassName =
    "h-9.5 w-full rounded-lg border border-border-strong bg-bg px-2.5 font-mono text-[13px] text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

  return (
    <div className="flex items-center gap-2">
      <label className="sr-only" htmlFor="price-min">
        Minimum price
      </label>
      <input
        id="price-min"
        type="number"
        inputMode="numeric"
        min={0}
        placeholder="Min"
        value={min}
        onChange={(e) => setMin(e.target.value)}
        onBlur={apply}
        onKeyDown={(e) => e.key === "Enter" && apply()}
        className={inputClassName}
      />
      <span className="text-tertiary" aria-hidden="true">
        –
      </span>
      <label className="sr-only" htmlFor="price-max">
        Maximum price
      </label>
      <input
        id="price-max"
        type="number"
        inputMode="numeric"
        min={0}
        placeholder="Max"
        value={max}
        onChange={(e) => setMax(e.target.value)}
        onBlur={apply}
        onKeyDown={(e) => e.key === "Enter" && apply()}
        className={inputClassName}
      />
    </div>
  );
}
