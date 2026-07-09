"use client";

import Link from "next/link";
import { hrefWithPatch, type ParsedFilters } from "@/lib/products-filter";
import { useLanguage } from "@/lib/useLanguage";

export interface PaginationProps {
  pathname: string;
  filters: ParsedFilters;
  page: number;
  pageCount: number;
  className?: string;
}

type PageToken = number | "dots";

function getPageTokens(page: number, pageCount: number): PageToken[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const keep = new Set<number>([1, pageCount, page, page - 1, page + 1]);
  const sorted = [...keep].filter((p) => p >= 1 && p <= pageCount).sort((a, b) => a - b);

  const tokens: PageToken[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) tokens.push("dots");
    tokens.push(p);
  });
  return tokens;
}

const linkBase =
  "grid h-9.5 min-w-9.5 place-items-center rounded-[9px] border px-2.5 font-mono text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";
const linkInactive = "border-border bg-surface text-secondary hover:bg-surface-2 hover:text-primary";
const linkActive = "border-accent bg-accent text-white";
const navLinkClasses = [linkBase, linkInactive, "font-sans px-3"].join(" ");
const navDisabledClasses =
  "grid h-9.5 place-items-center rounded-[9px] px-3 font-sans text-[13px] font-semibold text-tertiary opacity-50";

export function Pagination({ pathname, filters, page, pageCount, className }: PaginationProps) {
  const { t, lang } = useLanguage();

  if (pageCount <= 1) return null;

  const tokens = getPageTokens(page, pageCount);

  const prevText = lang === "fa" ? "‹ قبلی" : "‹ Prev";
  const nextText = lang === "fa" ? "بعدی ›" : "Next ›";

  return (
    <nav
      aria-label="Pagination"
      className={["mt-8 flex items-center justify-center gap-1.5", className ?? ""].filter(Boolean).join(" ")}
    >
      {page > 1 ? (
        <Link href={hrefWithPatch(pathname, filters, { page: page - 1, resetPage: false })} className={navLinkClasses}>
          {prevText}
        </Link>
      ) : (
        <span aria-disabled="true" className={navDisabledClasses}>
          {prevText}
        </span>
      )}

      {tokens.map((token, index) =>
        token === "dots" ? (
          <span key={`dots-${index}`} className="px-1 text-tertiary" aria-hidden="true">
            …
          </span>
        ) : (
          <Link
            key={token}
            href={hrefWithPatch(pathname, filters, { page: token, resetPage: false })}
            aria-current={token === page ? "page" : undefined}
            className={[linkBase, token === page ? linkActive : linkInactive].join(" ")}
          >
            {token}
          </Link>
        ),
      )}

      {page < pageCount ? (
        <Link href={hrefWithPatch(pathname, filters, { page: page + 1, resetPage: false })} className={navLinkClasses}>
          {nextText}
        </Link>
      ) : (
        <span aria-disabled="true" className={navDisabledClasses}>
          {nextText}
        </span>
      )}
    </nav>
  );
}
