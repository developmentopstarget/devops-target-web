"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CheckIcon, CloseIcon } from "@/components/ui/icons";

export interface AppliedPromo {
  code: string;
  discountRate: number;
}

export interface PromoCodeProps {
  applied: AppliedPromo | null;
  onApply: (promo: AppliedPromo) => void;
  onRemove: () => void;
  className?: string;
}

// Placeholder validation list — real codes will come from the Django API later.
const VALID_PROMOS: Record<string, number> = {
  SPRING10: 0.1,
  WELCOME5: 0.05,
};

type Status = "idle" | "applying" | "invalid";

export function PromoCode({ applied, onApply, onRemove, className }: PromoCodeProps) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  function handleApply() {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setStatus("applying");
    window.setTimeout(() => {
      const rate = VALID_PROMOS[trimmed];
      if (rate) {
        onApply({ code: trimmed, discountRate: rate });
        setStatus("idle");
        setCode("");
      } else {
        setStatus("invalid");
      }
    }, 500);
  }

  if (applied) {
    return (
      <div
        className={[
          "mb-4 flex items-center justify-between gap-2 rounded-lg bg-success/10 px-3 py-2.5 text-[13px] font-semibold text-success",
          className ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span className="flex items-center gap-1.5">
          <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Promo {applied.code} applied
        </span>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove promo code"
          className="text-success/70 hover:text-success"
        >
          <CloseIcon className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div className={["mb-4", className ?? ""].filter(Boolean).join(" ")}>
      <div className="flex gap-2">
        <Input
          placeholder="Promo code"
          aria-label="Promo code"
          value={code}
          disabled={status === "applying"}
          onChange={(e) => {
            setCode(e.target.value);
            if (status === "invalid") setStatus("idle");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
          wrapperClassName="flex-1"
          className="h-10.5"
        />
        <Button type="button" variant="secondary" loading={status === "applying"} onClick={handleApply} className="h-10.5">
          Apply
        </Button>
      </div>
      {status === "invalid" && <p className="mt-1.5 text-xs font-medium text-danger">Invalid or expired code.</p>}
    </div>
  );
}
