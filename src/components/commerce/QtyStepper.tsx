"use client";

export interface QtyStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export function QtyStepper({ value, min = 1, max, onChange, disabled, className }: QtyStepperProps) {
  const atMin = value <= min;
  const atMax = max !== undefined && value >= max;

  function clamp(next: number) {
    let result = next;
    if (result < min) result = min;
    if (max !== undefined && result > max) result = max;
    onChange(result);
  }

  return (
    <div
      className={[
        "inline-flex items-center overflow-hidden rounded-[10px] border border-border-strong",
        disabled ? "opacity-50" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabled || atMin}
        onClick={() => clamp(value - 1)}
        className="grid h-11 w-10 place-items-center bg-surface text-lg text-primary hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-40"
      >
        −
      </button>
      <input
        type="text"
        inputMode="numeric"
        aria-label="Quantity"
        value={value}
        disabled={disabled}
        onChange={(e) => {
          const parsed = Number(e.target.value.replace(/\D/g, ""));
          if (Number.isFinite(parsed) && parsed > 0) clamp(parsed);
        }}
        className="h-11 w-12 border-x border-border-strong bg-surface text-center font-mono text-[15px] font-semibold text-primary focus-visible:outline-none"
      />
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled || atMax}
        onClick={() => clamp(value + 1)}
        className="grid h-11 w-10 place-items-center bg-surface text-lg text-primary hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}
