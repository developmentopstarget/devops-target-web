"use client";

import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { CheckoutStepCard } from "@/components/commerce/CheckoutStepCard";
import { useLanguage } from "@/lib/useLanguage";
import { Input } from "@/components/ui/Input";

export interface PaymentFormHandle {
  confirmPayment: (clientSecret?: string, orderId?: number) => Promise<{ ok: boolean; message?: string }>;
  validate: () => boolean;
  paymentMethod: "zarinpal" | "bank_transfer";
}

export interface PaymentFormProps {
  billingSameAsDelivery: boolean;
  onBillingSameAsDeliveryChange: (value: boolean) => void;
}

interface BankAccount {
  id: number;
  bank_name: string;
  card_number: string;
  sheba_number: string;
  holder_name: string;
  is_active: boolean;
}

const CopyButton = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);
  const { lang } = useLanguage();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1 rounded bg-accent-soft px-2 py-1 text-xs font-bold text-accent hover:bg-accent hover:text-white transition-all cursor-pointer select-none"
    >
      {copied ? (
        <>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-semibold">{lang === "fa" ? "کپی شد" : "Copied"}</span>
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          <span className="font-semibold">{lang === "fa" ? "کپی" : "Copy"}</span>
        </>
      )}
    </button>
  );
};

export const PaymentForm = forwardRef<PaymentFormHandle, PaymentFormProps>(function PaymentForm(
  { billingSameAsDelivery, onBillingSameAsDeliveryChange },
  ref,
) {
  const { lang } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState<"zarinpal" | "bank_transfer">("bank_transfer");
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [accountsError, setAccountsError] = useState<string | null>(null);

  // Bank Transfer fields
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [errors, setErrors] = useState<{ receipt?: string; referenceNumber?: string }>({});

  useEffect(() => {
    if (paymentMethod === "bank_transfer") {
      setAccountsLoading(true);
      setAccountsError(null);
      fetch("/api/payments/bank-accounts")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load");
          return res.json() as Promise<BankAccount[]>;
        })
        .then((data) => {
          setBankAccounts(data.filter((a) => a.is_active));
        })
        .catch(() => {
          setAccountsError(
            lang === "fa"
              ? "خطا در دریافت اطلاعات حساب بانکی فروشگاه."
              : "Could not load shop bank accounts."
          );
        })
        .finally(() => {
          setAccountsLoading(false);
        });
    }
  }, [paymentMethod, lang]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setErrors((prev) => ({ ...prev, receipt: undefined }));

    if (!file) {
      setReceiptFile(null);
      setReceiptPreview(null);
      return;
    }

    // Size limit: 5MB
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        receipt: lang === "fa" ? "حجم فایل باید کمتر از ۵ مگابایت باشد." : "File size must be under 5MB.",
      }));
      setReceiptFile(null);
      setReceiptPreview(null);
      return;
    }

    // MIME type check
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        receipt: lang === "fa" ? "فرمت فایل باید JPG، JPEG یا PNG باشد." : "Format must be JPG, JPEG, or PNG.",
      }));
      setReceiptFile(null);
      setReceiptPreview(null);
      return;
    }

    setReceiptFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setReceiptPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  useImperativeHandle(ref, () => ({
    paymentMethod,
    validate() {
      if (paymentMethod === "bank_transfer") {
        const nextErrors: { receipt?: string; referenceNumber?: string } = {};
        if (!receiptFile) {
          nextErrors.receipt = lang === "fa" ? "بارگذاری رسید پرداخت الزامی است." : "Receipt screenshot is required.";
        }
        if (!referenceNumber.trim()) {
          nextErrors.referenceNumber = lang === "fa" ? "وارد کردن شماره پیگیری الزامی است." : "Reference number is required.";
        }
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
      }
      return true;
    },
    async confirmPayment(clientSecret?: string, orderId?: number): Promise<{ ok: boolean; message?: string }> {
      if (!orderId) {
        return {
          ok: false,
          message: lang === "fa" ? "شناسه سفارش نامعتبر است." : "Invalid order reference ID.",
        };
      }

      if (paymentMethod === "zarinpal") {
        return {
          ok: false,
          message: lang === "fa" ? "درگاه پرداخت آنلاین در حال حاضر غیرفعال است." : "Online payment is temporarily disabled.",
        };
        try {
          const res = await fetch("/api/payments/zarinpal/initiate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order_id: orderId }),
          });

          if (!res.ok) {
            const data = await res.json().catch(() => null);
            return {
              ok: false,
              message: data?.error || (lang === "fa" ? "خطا در اتصال به درگاه زرین‌پال." : "Failed to connect to Zarinpal gateway."),
            };
          }

          const data = await res.json();
          if (data?.payment_url) {
            window.location.href = data.payment_url;
            return { ok: true };
          } else {
            return {
              ok: false,
              message: lang === "fa" ? "پاسخ نامعتبر از درگاه زرین‌پال." : "Invalid response from Zarinpal portal.",
            };
          }
        } catch {
          return {
            ok: false,
            message: lang === "fa" ? "خطای شبکه در اتصال به درگاه پرداخت." : "Network connection failed.",
          };
        }
      } else {
        if (!receiptFile || !referenceNumber.trim()) {
          return {
            ok: false,
            message: lang === "fa" ? "لطفاً اطلاعات رسید پرداخت را تکمیل کنید." : "Complete receipt info.",
          };
        }

        try {
          const formData = new FormData();
          formData.append("order_id", String(orderId));
          formData.append("receipt_image", receiptFile);
          formData.append("reference_number", referenceNumber.trim());

          const res = await fetch("/api/payments/bank-transfer", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const data = await res.json().catch(() => null);
            return {
              ok: false,
              message: data?.error || data?.detail || (lang === "fa" ? "ثبت رسید پرداخت با خطا مواجه شد." : "Failed to upload transaction receipt."),
            };
          }

          return { ok: true };
        } catch {
          return {
            ok: false,
            message: lang === "fa" ? "خطای ارتباطی در ارسال رسید پرداخت." : "Network error uploading receipt.",
          };
        }
      }
    },
  }));

  const paymentOptions = [
    {
      id: "zarinpal" as const,
      title: lang === "fa" ? "درگاه آنلاین (زرین‌پال)" : "Online Gateway (Zarinpal)",
      description: lang === "fa" ? "بهزودی" : "Coming soon",
      disabled: true,
    },
    {
      id: "bank_transfer" as const,
      title: lang === "fa" ? "انتقال بانکی دستی (کارت به کارت / شبا)" : "Manual Bank Transfer (Card-to-Card / Sheba)",
      description: lang === "fa"
        ? "واریز به شماره کارت/حساب فروشگاه و بارگذاری تصویر رسید"
        : "Transfer funds manually and upload your payment receipt screenshot",
      disabled: false,
    },
  ];

  return (
    <CheckoutStepCard step={4} title={lang === "fa" ? "روش پرداخت" : "Payment method"}>
      <div role="radiogroup" aria-label="Payment method" className="grid gap-3">
        {paymentOptions.map((opt) => {
          const selected = paymentMethod === opt.id;
          return (
            <label
              key={opt.id}
              className={[
                "flex items-start gap-3 rounded-[12px] border p-4 transition-all",
                opt.disabled ? "opacity-50 cursor-not-allowed bg-surface-2 border-border-strong" : "cursor-pointer hover:bg-surface-2 bg-surface",
                selected && !opt.disabled ? "border-accent bg-accent-soft shadow-sm" : "border-border-strong",
              ].join(" ")}
            >
              <input
                type="radio"
                name="payment-method"
                checked={selected}
                disabled={opt.disabled}
                onChange={() => !opt.disabled && setPaymentMethod(opt.id)}
                className={[
                  "mt-0.5 h-4.5 w-4.5 accent-accent",
                  opt.disabled ? "cursor-not-allowed" : "cursor-pointer"
                ].join(" ")}
              />
              <span className="flex-1">
                <span className="block text-sm font-bold text-primary leading-tight">{opt.title}</span>
                <span className="block text-xs text-secondary mt-1 leading-normal">{opt.description}</span>
              </span>
            </label>
          );
        })}
      </div>

      {paymentMethod === "zarinpal" && (
        <div className="mt-4 rounded-xl border border-border bg-surface-2 p-4 text-[13px] leading-relaxed text-secondary">
          {lang === "fa"
            ? "شما برای تکمیل تراکنش به درگاه پرداخت آنلاین هدایت خواهید شد. بعد از تکمیل خرید، سفارش شما ثبت می‌گردد."
            : "You will be redirected to the secure Zarinpal payment gateway to complete your transaction."}
        </div>
      )}

      {paymentMethod === "bank_transfer" && (
        <div className="mt-5 space-y-5">
          {/* Instructions */}
          <div className="rounded-xl border border-border bg-surface-2 p-4 text-[13px] leading-relaxed text-secondary">
            {lang === "fa"
              ? "لطفاً مبلغ کل سفارش را به یکی از حساب‌های بانکی زیر واریز نموده و سپس مشخصات تراکنش و تصویر رسید را در فرم زیر وارد نمایید. پس از تأیید توسط مدیریت، سفارش شما وارد مرحله آماده‌سازی می‌شود."
              : "Please transfer the total order amount to one of our bank accounts listed below. Once transferred, enter the reference details and upload a screenshot of your receipt. We will process your order immediately upon verification."}
          </div>

          {/* Bank Accounts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary">
              {lang === "fa" ? "حساب‌های بانکی فروشگاه" : "Shop Bank Accounts"}
            </h4>

            {accountsLoading ? (
              <div className="space-y-2">
                <div className="h-20 w-full animate-pulse rounded-xl bg-surface-2" />
                <div className="h-20 w-full animate-pulse rounded-xl bg-surface-2" />
              </div>
            ) : accountsError ? (
              <div className="rounded-lg bg-danger/10 px-3 py-2 text-xs font-medium text-danger">
                {accountsError}
              </div>
            ) : bankAccounts.length === 0 ? (
              <div className="text-xs text-secondary italic">
                {lang === "fa" ? "هیچ حساب بانکی فعالی تعریف نشده است." : "No active bank accounts found."}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {bankAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="rounded-xl border border-border bg-surface p-4 text-xs space-y-2.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between border-b border-border pb-1.5">
                      <span className="font-bold text-primary">{account.bank_name}</span>
                      <span className="text-[10px] bg-accent-soft text-accent px-1.5 py-0.5 rounded font-bold uppercase">
                        {lang === "fa" ? "حساب فعال" : "Active"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-tertiary block font-semibold">
                        {lang === "fa" ? "صاحب حساب" : "Account Holder"}
                      </span>
                      <span className="text-primary font-bold">{account.holder_name}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-tertiary font-semibold">{lang === "fa" ? "شماره کارت" : "Card Number"}</span>
                        <CopyButton value={account.card_number} />
                      </div>
                      <span className="text-primary font-mono font-bold tracking-wider block bg-surface-2 px-2 py-1 rounded text-center border border-border-strong">
                        {account.card_number.replace(/(\d{4})/g, "$1 ").trim()}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-tertiary font-semibold">{lang === "fa" ? "شماره شبا (IBAN)" : "Sheba Number"}</span>
                        <CopyButton value={account.sheba_number} />
                      </div>
                      <span className="text-primary font-mono font-bold block bg-surface-2 px-2 py-1 rounded text-center border border-border-strong truncate">
                        {account.sheba_number}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reference & Upload Form */}
          <div className="space-y-4 border-t border-border pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary">
              {lang === "fa" ? "اطلاعات پرداخت" : "Payment Information"}
            </h4>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Reference Number */}
              <div>
                <Input
                  label={lang === "fa" ? "شماره پیگیری / شناسه تراکنش" : "Reference Number / Transaction ID"}
                  placeholder={lang === "fa" ? "مثال: 1234567890" : "e.g., 1234567890"}
                  required
                  value={referenceNumber}
                  error={errors.referenceNumber}
                  onChange={(e) => {
                    setReferenceNumber(e.target.value);
                    setErrors((prev) => ({ ...prev, referenceNumber: undefined }));
                  }}
                />
              </div>

              {/* Receipt File Upload */}
              <div>
                <label className="mb-1.5 block text-[15px] sm:text-sm font-medium text-primary">
                  {lang === "fa" ? "تصویر رسید پرداخت" : "Receipt Screenshot"}
                  <span className="text-danger ml-1">*</span>
                </label>

                <div className="relative flex flex-col items-center justify-center rounded-[10px] border border-dashed border-border-strong bg-surface p-4 transition-all hover:border-accent">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    onChange={handleFileChange}
                  />

                  {receiptPreview ? (
                    <div className="flex w-full items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={receiptPreview}
                        alt="Receipt preview"
                        className="h-14 w-14 rounded-lg object-cover border border-border shadow-sm shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-primary">{receiptFile?.name}</p>
                        <p className="text-[10px] text-secondary">
                          {receiptFile ? (receiptFile.size / 1024 / 1024).toFixed(2) : 0} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setReceiptFile(null);
                          setReceiptPreview(null);
                        }}
                        className="rounded bg-danger/10 p-1.5 text-danger hover:bg-danger hover:text-white transition-all cursor-pointer z-10"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center space-y-1">
                      <svg
                        className="mx-auto h-8 w-8 text-tertiary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
                        />
                      </svg>
                      <p className="text-xs font-semibold text-primary">
                        {lang === "fa" ? "انتخاب تصویر رسید" : "Upload Receipt Image"}
                      </p>
                      <p className="text-[10px] text-tertiary">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>

                {errors.receipt && (
                  <p role="alert" className="mt-1.5 text-xs font-medium text-danger">
                    {errors.receipt}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legacy billingSameAsDelivery check preserved in props, hidden to avoid layout noise */}
      {false && (
        <label className="mt-3 flex items-center gap-2.25 text-[13px] text-secondary">
          <input
            type="checkbox"
            checked={billingSameAsDelivery}
            onChange={(e) => onBillingSameAsDeliveryChange(e.target.checked)}
            className="h-4 w-4 accent-accent"
          />
          Billing address same as delivery
        </label>
      )}
    </CheckoutStepCard>
  );
});
