import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={["flex flex-wrap items-center gap-1.75 py-3 text-[12.5px] text-tertiary", className ?? ""]
        .filter(Boolean)
        .join(" ")}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-1.75">
            {index > 0 && (
              <span aria-hidden="true" className="opacity-50">
                /
              </span>
            )}
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-secondary">
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-secondary" aria-current={isLast ? "page" : undefined}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
