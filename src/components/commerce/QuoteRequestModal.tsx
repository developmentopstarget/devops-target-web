"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { CloseIcon, CheckIcon, LockIcon } from "@/components/ui/icons";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useLanguage } from "@/lib/useLanguage";
import type { Product } from "@/data/products";

export interface QuoteRequestModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const IRAN_PHONE_REGEX = /^(\+98|0)?9\d{9}$/;

export function QuoteRequestModal({ product, isOpen, onClose }: QuoteRequestModalProps) {
  const { user } = useAuth();
  const { lang, isRtl } = useLanguage();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (quantity < 1) {
      newErrors.quantity = lang === "fa" ? "تعداد باید حداقل ۱ باشد." : "Quantity must be at least 1.";
    }

    const cleanPhone = phone.replace(/[\s\-()]/g, "");
    if (!phone.trim()) {
      newErrors.phone = lang === "fa" ? "شماره تماس الزامی است." : "Phone number is required.";
    } else if (!IRAN_PHONE_REGEX.test(cleanPhone)) {
      newErrors.phone =
        lang === "fa"
          ? "شماره تلفن همراه معتبر وارد کنید (مانند ۰۹۱۲۳۴۵۶۷۸۹)."
          : "Enter a valid Iranian mobile number (e.g. 09123456789).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError(null);

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: product.slug,
          product_name: product.name,
          quantity: quantity,
          contact_phone: phone,
          message: message,
        }),
      });

      if (res.status === 401) {
        setApiError(lang === "fa" ? "نشست شما منقضی شده است. لطفا دوباره وارد شوید." : "Session expired. Please sign in again.");
        setSubmitting(false);
        return;
      }

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setApiError(data?.detail || data?.error || (lang === "fa" ? "ثبت درخواست با خطا مواجه شد." : "Failed to submit request."));
        setSubmitting(false);
        return;
      }

      setSuccess(true);
    } catch {
      setApiError(lang === "fa" ? "خطا در اتصال به سرور." : "Could not connect to the server.");
    } finally {
      setSubmitting(false);
    }
  };

  const loginRedirectUrl = `/login?next=${encodeURIComponent(
    typeof window !== "undefined" ? window.location.pathname + window.location.search : ""
  )}`;

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all duration-300"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative flex w-full max-w-md flex-col rounded-2xl border border-border bg-surface p-6 shadow-2xl transition-all scale-100"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Close Button */}
        <IconButton
          icon={<CloseIcon className="h-4.5 w-4.5" aria-hidden="true" />}
          label={lang === "fa" ? "بستن" : "Close"}
          onClick={onClose}
          className="absolute top-4 end-4"
        />

        {!user ? (
          /* Sign In Screen */
          <div className="flex flex-col items-center text-center py-6 gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
              <LockIcon className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-primary">
              {lang === "fa" ? "ورود به حساب کاربری" : "Sign In Required"}
            </h2>
            <p className="text-sm text-secondary px-2">
              {lang === "fa"
                ? "برای ثبت درخواست قیمت، ابتدا باید وارد حساب کاربری خود شوید."
                : "Please sign in to your account to request a quote for this product."}
            </p>
            <Button
              type="button"
              className="mt-2 w-full"
              onClick={() => {
                router.push(loginRedirectUrl);
              }}
            >
              {lang === "fa" ? "ورود / ثبت نام" : "Sign In / Register"}
            </Button>
          </div>
        ) : success ? (
          /* Success Screen */
          <div className="flex flex-col items-center text-center py-6 gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
              <CheckIcon className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-primary">
              {lang === "fa" ? "درخواست با موفقیت ثبت شد" : "Request Sent!"}
            </h2>
            <p className="text-sm text-secondary px-2">
              {lang === "fa"
                ? `درخواست شما برای ${quantity} عدد "${product.name}" ثبت گردید. کارشناسان ما به زودی با شما تماس خواهند گرفت.`
                : `Your quote request for ${quantity} × "${product.name}" has been recorded. Our team will contact you shortly.`}
            </p>
            <div className="mt-4 flex w-full flex-col gap-2">
              <Button
                type="button"
                variant="primary"
                fullWidth
                onClick={() => {
                  onClose();
                  router.push("/account/quotes");
                }}
              >
                {lang === "fa" ? "مشاهده درخواست‌های من" : "View My Requests"}
              </Button>
              <Button type="button" variant="secondary" fullWidth onClick={onClose}>
                {lang === "fa" ? "بستن" : "Close"}
              </Button>
            </div>
          </div>
        ) : (
          /* Form Screen */
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-primary pe-8">
              {lang === "fa" ? "درخواست قیمت / تماس بگیرید" : "Request a Quote"}
            </h2>

            {/* Product info banner */}
            <div className="rounded-xl bg-surface-2 p-3 text-sm border border-border">
              <span className="block font-semibold text-primary">{product.name}</span>
              <span className="block text-xs text-secondary mt-1">{product.spec}</span>
            </div>

            {apiError && (
              <div className="rounded-lg bg-danger/10 p-3 text-xs font-medium text-danger">
                {apiError}
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="mb-1.5 block text-[15px] sm:text-sm font-medium text-primary">
                {lang === "fa" ? "تعداد مورد نیاز" : "Quantity Required"}
                <span className="text-danger"> *</span>
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                disabled={submitting}
                className="h-11 w-full rounded-[10px] border border-border-strong bg-bg px-3 text-[15px] text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
              {errors.quantity && <p className="mt-1.5 text-xs font-medium text-danger">{errors.quantity}</p>}
            </div>

            {/* Contact Phone */}
            <Input
              type="tel"
              required
              label={lang === "fa" ? "شماره تلفن همراه" : "Contact Phone"}
              placeholder={lang === "fa" ? "۰۹۱۲۳۴۵۶۷۸۹" : "09123456789"}
              value={phone}
              error={errors.phone}
              disabled={submitting}
              onChange={(e) => setPhone(e.target.value)}
            />

            {/* Message */}
            <div>
              <label className="mb-1.5 block text-[15px] sm:text-sm font-medium text-primary">
                {lang === "fa" ? "توضیحات و مشخصات درخواستی" : "Message / Additional Specs"}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={submitting}
                rows={3}
                placeholder={
                  lang === "fa"
                    ? "توضیحات، زمان تحویل درخواستی یا هرگونه مشخصات فنی خاص را بنویسید..."
                    : "Add any requirements, specific specs, or preferred delivery timing..."
                }
                className="w-full rounded-[10px] border border-border-strong bg-bg px-3 py-2 text-[15px] text-primary placeholder:text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" variant="primary" fullWidth loading={submitting} className="mt-2">
              {lang === "fa" ? "ارسال درخواست" : "Submit Request"}
            </Button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
