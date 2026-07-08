"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckIcon, CloseIcon } from "@/components/ui/icons";

type ToastVariant = "success" | "error" | "info" | "warning";

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  show: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const variantClasses: Record<ToastVariant, string> = {
  success: "bg-success text-white",
  error: "bg-danger text-white",
  info: "bg-info text-white",
  warning: "bg-warning text-white",
};

let idCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    (message: string, variant: ToastVariant = "success") => {
      const id = ++idCounter;
      setToasts((current) => [...current, { id, message, variant }]);
      setTimeout(() => dismiss(id), 3000);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={[
              "pointer-events-auto flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-lg",
              variantClasses[toast.variant],
            ].join(" ")}
          >
            {toast.variant === "success" && <CheckIcon className="h-4 w-4 shrink-0" />}
            <span>{toast.message}</span>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => dismiss(toast.id)}
              className="ms-1 rounded-full p-0.5 hover:bg-white/20"
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
