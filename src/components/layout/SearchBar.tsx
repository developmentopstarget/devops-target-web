import { SearchIcon } from "@/components/ui/icons";

export interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  return (
    <form
      action="/search"
      method="GET"
      role="search"
      className={["relative", className ?? ""].filter(Boolean).join(" ")}
    >
      <SearchIcon
        className="pointer-events-none absolute inset-inline-start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-tertiary"
        aria-hidden="true"
      />
      <input
        type="search"
        name="q"
        placeholder="Search laptops, GPUs, monitors…"
        aria-label="Search products"
        className="h-10 w-full rounded-[10px] border border-border-strong bg-bg ps-9 pe-3 text-[13.5px] text-primary placeholder:text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      />
    </form>
  );
}
