import { useId, type InputHTMLAttributes, type ReactNode } from "react";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  iconStart?: ReactNode;
  wrapperClassName?: string;
}

export function Input({
  label,
  hint,
  error,
  iconStart,
  className,
  wrapperClassName,
  id,
  required,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={wrapperClassName}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-primary">
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
      )}
      <div className="relative">
        {iconStart && (
          <span className="pointer-events-none absolute inset-inline-start-3 top-1/2 -translate-y-1/2 text-tertiary">
            {iconStart}
          </span>
        )}
        <input
          id={inputId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
          className={[
            "h-11 w-full rounded-[10px] border bg-bg px-3 text-[15px] text-primary placeholder:text-tertiary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            "disabled:opacity-50 disabled:pointer-events-none",
            iconStart ? "ps-10" : "",
            error ? "border-danger" : "border-border-strong",
            className ?? "",
          ]
            .filter(Boolean)
            .join(" ")}
          {...rest}
        />
      </div>
      {error ? (
        <p id={errorId} className="mt-1.5 text-xs font-medium text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-secondary">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
