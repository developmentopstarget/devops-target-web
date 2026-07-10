import { SearchIcon } from "@/components/ui/icons";
import { useLanguage } from "@/lib/useLanguage";

export interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const { t, isRtl } = useLanguage();

  return (
    <form
      action="/search"
      method="GET"
      role="search"
      dir="ltr"
      className={["relative", className ?? ""].filter(Boolean).join(" ")}
    >
      <SearchIcon
        className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-tertiary"
        aria-hidden="true"
      />
      <input
        type="search"
        name="q"
        dir={isRtl ? "rtl" : "ltr"}
        placeholder={t("searchPlaceholder")}
        aria-label={t("searchPlaceholder")}
        className="h-10 w-full rounded-[10px] border border-border-strong bg-bg pl-10 pr-3 text-[13.5px] text-primary placeholder:text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      />
    </form>
  );
}
