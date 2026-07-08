"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckIcon, ChevronDownIcon, SortIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";
import { hrefWithPatch, sortOptions, type ParsedFilters, type SortValue } from "@/lib/products-filter";

export interface SortDropdownProps {
  pathname: string;
  filters: ParsedFilters;
  className?: string;
}

export function SortDropdown({ pathname, filters, className }: SortDropdownProps) {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (!sheetOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSheetOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  function applySort(value: SortValue) {
    router.push(hrefWithPatch(pathname, filters, { sort: value, resetPage: false }));
    setSheetOpen(false);
  }

  const currentLabel = sortOptions.find((o) => o.value === filters.sort)?.label ?? "Sort";

  return (
    <div className={className}>
      <div className="hidden items-center gap-2 lg:flex">
        <label htmlFor="sort-select" className="text-[12.5px] text-secondary">
          Sort
        </label>
        <div className="relative">
          <select
            id="sort-select"
            value={filters.sort}
            onChange={(e) => applySort(e.target.value as SortValue)}
            className="h-9.5 appearance-none rounded-lg border border-border-strong bg-surface ps-3 pe-8 text-[13px] font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon
            className="pointer-events-none absolute inset-inline-end-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary"
            aria-hidden="true"
          />
        </div>
      </div>

      <Button
        type="button"
        variant="secondary"
        fullWidth
        iconStart={<SortIcon className="h-4 w-4" aria-hidden="true" />}
        onClick={() => setSheetOpen(true)}
        className="lg:hidden"
      >
        Sort: {currentLabel}
      </Button>

      {sheetOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close sort options"
            className="absolute inset-0 bg-slate-950/50"
            onClick={() => setSheetOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Sort by"
            className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-surface p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-lg"
          >
            <h2 className="mb-3 text-base font-bold text-primary">Sort by</h2>
            <div className="flex flex-col">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => applySort(option.value)}
                  className="flex items-center justify-between rounded-lg px-3 py-3 text-start text-[14px] font-medium text-primary hover:bg-surface-2"
                >
                  {option.label}
                  {filters.sort === option.value && <CheckIcon className="h-4 w-4 text-accent" aria-hidden="true" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
