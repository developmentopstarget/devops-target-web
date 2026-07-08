import type { SpecRow } from "@/data/product-details";

export interface SpecTableProps {
  specs: SpecRow[];
  className?: string;
}

export function SpecTable({ specs, className }: SpecTableProps) {
  return (
    <div
      className={["max-w-160 overflow-hidden rounded-xl border border-border", className ?? ""]
        .filter(Boolean)
        .join(" ")}
    >
      {specs.map((row, i) => (
        <div
          key={row.label}
          className={["grid grid-cols-[40%_60%] text-[13.5px]", i % 2 === 0 ? "bg-surface-2" : "bg-surface"].join(
            " ",
          )}
        >
          <div className="px-3.5 py-2.75 font-semibold text-secondary">{row.label}</div>
          <div className="px-3.5 py-2.75 font-mono text-primary">{row.value}</div>
        </div>
      ))}
    </div>
  );
}
