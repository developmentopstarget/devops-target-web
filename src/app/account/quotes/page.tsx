"use client";

import { useToast } from "@/components/ui/Toast";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { DollarIcon } from "@/components/ui/icons";
import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/currency";
import { useLanguage } from "@/lib/useLanguage";
import { useRouter } from "next/navigation";

interface QuoteRequest {
  id: number;
  product: string;
  product_name: string;
  user: string;
  quantity: number;
  contact_phone: string;
  message: string;
  status: "new" | "contacted" | "quoted" | "approved" | "closed";
  agreed_price: string | null;
  order_id: number | null;
  order_number: string | null;
  created_at: string;
}

export default function QuotesPage() {
  const toast = useToast();
  const router = useRouter();
  const { lang, isRtl } = useLanguage();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const fetchQuotes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/quotes");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = (await res.json()) as QuoteRequest[];
        setQuotes(data);
      } catch {
        setError(lang === "fa" ? "خطا در دریافت درخواست‌های قیمت." : "Could not load your quote requests.");
        toast.show(lang === "fa" ? "خطا در دریافت درخواست‌های قیمت." : "Could not load your quote requests.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuotes();
  }, [toast, lang, reloadKey]);

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString(lang === "fa" ? "fa-IR" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return new Date(isoString).toLocaleDateString("en-US");
    }
  };

  const getStatusBadge = (status: QuoteRequest["status"]) => {
    const statusMap: Record<QuoteRequest["status"], { label: string; variant: BadgeVariant }> = {
      new: {
        label: lang === "fa" ? "جدید" : "New",
        variant: "info",
      },
      contacted: {
        label: lang === "fa" ? "در حال بررسی" : "Contacted",
        variant: "warning",
      },
      quoted: {
        label: lang === "fa" ? "قیمت پیشنهادی" : "Price Offered",
        variant: "accent",
      },
      approved: {
        label: lang === "fa" ? "تایید شده" : "Approved",
        variant: "success",
      },
      closed: {
        label: lang === "fa" ? "بسته‌شده" : "Closed",
        variant: "neutral",
      },
    };

    const config = statusMap[status] || { label: status, variant: "neutral" as BadgeVariant };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="max-w-full overflow-x-hidden box-border space-y-6 px-4" dir={isRtl ? "rtl" : "ltr"}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: lang === "fa" ? "خانه" : "Home", href: "/" },
          { label: lang === "fa" ? "حساب کاربری" : "Account", href: "/account" },
          { label: lang === "fa" ? "درخواست‌های قیمت" : "Quotes", href: "/account/quotes" },
        ]}
      />

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-primary">
          {lang === "fa" ? "درخواست‌های قیمت من" : "My Quote Requests"}
        </h1>
        <p className="text-[13px] text-secondary">
          {lang === "fa"
            ? "درخواست‌های قیمت ثبت شده برای کالاها و خدمات را مدیریت و پرداخت کنید."
            : "View and manage pricing quotes requested for custom builds or services."}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i} className="p-5">
              <div className="flex items-center justify-between gap-4 border-b border-border pb-3 mb-4">
                <div className="h-5 w-24 bg-surface-2 rounded animate-pulse" />
                <div className="h-5 w-16 bg-surface-2 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-1/2 bg-surface-2 rounded animate-pulse" />
                <div className="h-4 w-1/4 bg-surface-2 rounded animate-pulse" />
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <ErrorBanner message={error} onRetry={() => setReloadKey((k) => k + 1)} />
      ) : quotes.length === 0 ? (
        <EmptyState
          icon={<DollarIcon className="h-6 w-6" />}
          title={lang === "fa" ? "درخواستی یافت نشد" : "No quotes found"}
          description={lang === "fa" ? "شما هنوز هیچ درخواست قیمتی ثبت نکرده‌اید." : "You haven't requested any pricing quotes yet."}
          action={
            <Button as="a" href="/products">
              {lang === "fa" ? "مشاهده فروشگاه" : "Browse Shop"}
            </Button>
          }
          className="py-12"
        />
      ) : (
        <div className="space-y-4">
          {quotes.map((quote) => (
            <Card key={quote.id} className="p-5 border border-border">
              {/* Card Header */}
              <div className="flex items-center justify-between gap-4 border-b border-border pb-3 mb-4">
                <div>
                  <span className="text-xs font-semibold text-tertiary block">
                    {lang === "fa" ? `درخواست #${quote.id}` : `Request #${quote.id}`}
                  </span>
                  <span className="text-xs font-medium text-secondary block mt-0.5">
                    {formatDate(quote.created_at)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(quote.status)}
                </div>
              </div>

              {/* Card Content */}
              <div className="grid gap-4 md:grid-cols-[1fr_auto] items-start">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-primary">
                    {quote.product_name || quote.product}
                  </h3>
                  <div className="text-sm text-secondary space-y-1">
                    <p>
                      <span className="font-semibold text-primary">{lang === "fa" ? "تعداد: " : "Quantity: "}</span>
                      {quote.quantity}
                    </p>
                    <p>
                      <span className="font-semibold text-primary">{lang === "fa" ? "شماره تماس: " : "Contact Phone: "}</span>
                      <span className="font-mono">{quote.contact_phone}</span>
                    </p>
                    {quote.message && (
                      <p className="mt-2 bg-surface-2 p-2.5 rounded-lg border border-border text-xs leading-relaxed italic max-w-xl">
                        {quote.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="flex flex-col items-stretch md:items-end gap-3 mt-4 md:mt-0 w-full md:w-auto">
                  {(quote.status === "approved" || quote.agreed_price) && (
                    <div className="text-center md:text-end">
                      <span className="text-xs text-tertiary block">{lang === "fa" ? "قیمت توافق شده" : "Agreed Price"}</span>
                      <span className="text-lg font-bold font-mono text-success block mt-0.5">
                        {quote.agreed_price ? formatCurrency(Number(quote.agreed_price)) : "—"}
                      </span>
                    </div>
                  )}

                  {quote.status === "approved" && quote.order_id && (
                    <Button
                      type="button"
                      variant="primary"
                      className="w-full md:w-auto font-bold px-6 shadow-sm hover:shadow bg-success hover:bg-success/90 text-white border-0"
                      onClick={() => {
                        router.push(`/checkout?order_id=${quote.order_id}`);
                      }}
                    >
                      {lang === "fa" ? "پرداخت" : "Pay Now"}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
