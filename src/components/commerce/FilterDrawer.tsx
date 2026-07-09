"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { CloseIcon, FilterIcon } from "@/components/ui/icons";
import { FilterPanel, type FilterPanelProps } from "@/components/commerce/FilterPanel";
import { countActiveDimensions } from "@/lib/products-filter";
import { useLanguage } from "@/lib/useLanguage";

export interface FilterDrawerProps extends FilterPanelProps {
  resultCount: number;
}

export function FilterDrawer({ resultCount, ...panelProps }: FilterDrawerProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const activeCount = countActiveDimensions(panelProps.filters);
  const { t, lang } = useLanguage();

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  function clearAll() {
    router.push(panelProps.pathname);
    setOpen(false);
  }

  const filtersLabel = t("filters");
  const clearLabel = lang === "fa" ? "پاک کردن" : "Clear";
  const closeLabel = lang === "fa" ? "بستن فیلترها" : "Close filters";
  const showResultsLabel = lang === "fa"
    ? `نمایش ${resultCount} نتیجه`
    : `Show ${resultCount} results`;

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        fullWidth
        iconStart={<FilterIcon className="h-4 w-4" aria-hidden="true" />}
        onClick={() => setOpen(true)}
      >
        {filtersLabel}{activeCount > 0 ? ` (${activeCount})` : ""}
      </Button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label={closeLabel}
            className="absolute inset-0 bg-slate-950/50"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={filtersLabel}
            className="absolute inset-y-0 end-0 flex w-[86%] max-w-85 flex-col bg-surface shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="text-base font-bold text-primary">{filtersLabel}</h2>
              <IconButton
                icon={<CloseIcon className="h-[18px] w-[18px]" aria-hidden="true" />}
                label={closeLabel}
                onClick={() => setOpen(false)}
              />
            </div>
            <div className="flex-1 overflow-y-auto px-4">
              <FilterPanel {...panelProps} showHeader={false} />
            </div>
            <div className="flex gap-2.5 border-t border-border p-4">
              <Button type="button" variant="secondary" fullWidth onClick={clearAll}>
                {clearLabel}
              </Button>
              <Button type="button" variant="primary" fullWidth onClick={() => setOpen(false)}>
                {showResultsLabel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
