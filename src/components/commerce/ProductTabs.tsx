"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useLanguage } from "@/lib/useLanguage";

export interface ProductTab {
  id: string;
  label: string;
  content: ReactNode;
}

export interface ProductTabsProps {
  tabs: ProductTab[];
  className?: string;
}

export function ProductTabs({ tabs, className }: ProductTabsProps) {
  const [active, setActive] = useState(0);
  const idBase = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { t } = useLanguage();

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();

    let next = active;
    if (event.key === "ArrowRight") next = (active + 1) % tabs.length;
    if (event.key === "ArrowLeft") next = (active - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;

    setActive(next);
    tabRefs.current[next]?.focus();
  }

  const getTabLabel = (id: string, defaultLabel: string) => {
    if (id === "specs") return t("specs");
    if (id === "overview") return t("overview");
    if (id === "reviews") {
      const match = defaultLabel.match(/\d+/);
      const count = match ? match[0] : "";
      return count ? `${t("reviews")} (${count})` : t("reviews");
    }
    if (id === "shipping") return t("shippingReturns");
    return defaultLabel;
  };

  return (
    <div className={["mt-10 border-t border-border", className ?? ""].filter(Boolean).join(" ")}>
      <div
        role="tablist"
        aria-label="Product information"
        className="flex gap-1 overflow-x-auto border-b border-border"
        onKeyDown={onKeyDown}
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${idBase}-tab-${tab.id}`}
            aria-selected={active === i}
            aria-controls={`${idBase}-panel-${tab.id}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            className={[
              "whitespace-nowrap border-b-2 px-4 py-3.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              active === i ? "border-accent text-accent" : "border-transparent text-secondary hover:text-primary",
            ].join(" ")}
          >
            {getTabLabel(tab.id, tab.label)}
          </button>
        ))}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${idBase}-panel-${tab.id}`}
          aria-labelledby={`${idBase}-tab-${tab.id}`}
          hidden={active !== i}
          className="py-5.5"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
