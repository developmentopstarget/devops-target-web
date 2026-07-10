import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icons";

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
  type,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={wrapperClassName}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-[15px] sm:text-sm font-medium text-primary">
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          required={required}
          type={inputType}
          aria-invalid={Boolean(error)}
          aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
          className={[
            "h-11 w-full rounded-[10px] border bg-bg px-3 text-[15px] text-primary placeholder:text-tertiary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            "disabled:opacity-50 disabled:pointer-events-none",
            iconStart && isPassword ? "pr-12" : (iconStart || isPassword ? "pr-10" : ""),
            error ? "border-danger" : "border-border-strong",
            className ?? "",
          ]
            .filter(Boolean)
            .join(" ")}
          {...rest}
        />
        {iconStart && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-tertiary z-10">
            {iconStart}
          </span>
        )}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className={[
              "absolute top-1/2 -translate-y-1/2 flex items-center justify-center text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md p-1 cursor-pointer z-10",
              iconStart ? "right-9" : "right-3",
            ]
              .filter(Boolean)
              .join(" ")}
            title={showPassword ? "Hide password" : "Show password"}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOffIcon className="h-4.5 w-4.5" aria-hidden="true" />
            ) : (
              <EyeIcon className="h-4.5 w-4.5" aria-hidden="true" />
            )}
          </button>
        )}
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
