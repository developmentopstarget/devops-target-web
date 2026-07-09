"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { iconButtonClassName } from "@/components/ui/IconButton";
import { LogoMarkIcon, BellIcon, CloseIcon } from "@/components/ui/icons";
import { primaryNav } from "@/config/nav";
import { Container } from "@/components/layout/Container";
import { SearchBar } from "@/components/layout/SearchBar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { CartButton } from "@/components/layout/CartButton";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import { useLanguage } from "@/lib/useLanguage";
import { useState, useEffect } from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { useToast } from "@/components/ui/Toast";

interface NotificationItem {
  id: number;
  titleKey: "orderPaidConfirmed" | "securityAlertNewDevice" | "specialOfferPCParts";
  bodyKey: "orderPaidConfirmedBody" | "securityAlertNewDeviceBody" | "specialOfferPCPartsBody";
  time: string;
  read: boolean;
  type: "order" | "security" | "promo";
}

export function Navbar() {
  const { t, lang, isRtl } = useLanguage();
  const toast = useToast();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      titleKey: "orderPaidConfirmed",
      bodyKey: "orderPaidConfirmedBody",
      time: "2 hours ago",
      read: false,
      type: "order",
    },
    {
      id: 2,
      titleKey: "securityAlertNewDevice",
      bodyKey: "securityAlertNewDeviceBody",
      time: "1 day ago",
      read: true,
      type: "security",
    },
    {
      id: 3,
      titleKey: "specialOfferPCParts",
      bodyKey: "specialOfferPCPartsBody",
      time: "3 days ago",
      read: true,
      type: "promo",
    },
  ]);

  const handleToggleDirection = () => {
    if (typeof window !== "undefined") {
      const nextDir = isRtl ? "ltr" : "rtl";
      document.documentElement.dir = nextDir;
      document.documentElement.lang = nextDir === "rtl" ? "fa" : "en";
      window.dispatchEvent(new Event("languagechange"));
    }
  };

  const handleNotificationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowNotifications(!showNotifications);
  };

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.show(t("markAllReadSuccess"), "success");
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNotifications([]);
    toast.show(t("notificationsCleared"), "info");
  };

  const handleNotificationItemClick = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const translateTime = (timeStr: string) => {
    if (lang !== "fa") return timeStr;
    const digitsMap: Record<string, string> = {
      "1": "۱", "2": "۲", "3": "۳", "4": "۴", "5": "۵", "6": "۶", "7": "۷", "8": "۸", "9": "۹", "0": "۰"
    };
    let result = timeStr;
    Object.entries(digitsMap).forEach(([enDigit, faDigit]) => {
      result = result.replaceAll(enDigit, faDigit);
    });
    result = result.replace("hours ago", t("hoursAgo"));
    result = result.replace("days ago", t("daysAgo"));
    result = result.replace("day ago", t("dayAgo"));
    return result;
  };

  useEffect(() => {
    if (!showNotifications) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".notification-container")) {
        setShowNotifications(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowNotifications(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-surface px-2 border-b flex items-center gap-2 max-w-full overflow-hidden">
      {/* Mobile Drawer is hidden on mobile screens now, but keep it on desktop (though hidden there too by Tailwind usually) */}
      <div className="hidden lg:block">
        <MobileDrawer />
      </div>

      {/* Logo: hidden on mobile, shown on lg */}
      <Link
        href="/"
        className="hidden lg:flex shrink-0 items-center gap-2.5 text-[16px] font-extrabold tracking-tight text-primary"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-gradient-to-br from-accent to-accent-hover text-white">
          <LogoMarkIcon className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
        {isRtl ? (
          <>
            دیواپس<span className="text-accent">تارگت</span>
          </>
        ) : (
          <>
            DevOps<span className="text-accent">Target</span>
          </>
        )}
      </Link>

      {/* Desktop Navigation Links */}
      <nav className="ms-2 hidden items-center gap-1 lg:flex" aria-label="Primary">
        {primaryNav.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg px-3 py-2 text-[13.5px] font-semibold text-secondary hover:bg-surface-2 hover:text-primary"
          >
            {isRtl ? link.labelFa || link.label : link.label}
          </Link>
        ))}
      </nav>

      {/* SearchBar: on mobile it grows on the left. On desktop it has max-w-[420px] */}
      <SearchBar className="flex-1 max-w-full lg:max-w-[420px]" />

      {/* Controls container */}
      <div className="ms-auto flex items-center gap-1.5">
        {/* Language button */}
        <button
          onClick={handleToggleDirection}
          className={iconButtonClassName()}
          title={isRtl ? "Switch to English" : "تغییر به فارسی"}
          aria-label="Toggle language"
        >
          <span className="text-[12px] font-bold tracking-tight">
            {isRtl ? "EN" : "فا"}
          </span>
        </button>

        {/* Theme appearance toggle */}
        <ThemeToggle />

        {/* Notification alerts */}
        <div className="relative notification-container flex items-center justify-center">
          <button
            onClick={handleNotificationClick}
            title={t("notifications")}
            aria-label={t("notifications")}
            className={`${iconButtonClassName()} relative`}
          >
            <BellIcon className="h-[19px] w-[19px]" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger animate-pulse" />
            )}
          </button>

          {/* Desktop Dropdown Panel */}
          {showNotifications && (
            <div className="hidden lg:block absolute right-0 top-full mt-2 w-96 rounded-xl border border-border bg-surface shadow-lg z-50 overflow-hidden ltr:right-0 rtl:left-0">
              <div className="p-4 border-b border-border flex items-center justify-between bg-surface-2">
                <h3 className="text-sm font-bold text-primary">
                  {t("notifications")}
                </h3>
                {notifications.length > 0 && (
                  <div className="flex gap-2 text-xs">
                    <button
                      onClick={handleMarkAllRead}
                      className="font-bold text-accent hover:text-accent-hover cursor-pointer"
                    >
                      {t("markAllRead")}
                    </button>
                    <span className="text-tertiary">·</span>
                    <button
                      onClick={handleClearAll}
                      className="font-bold text-danger hover:opacity-85 cursor-pointer"
                    >
                      {t("clearAll")}
                    </button>
                  </div>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-border bg-surface">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-secondary text-xs">
                    {t("noNotifications")}
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationItemClick(n.id)}
                      className={`p-3.5 flex gap-3 text-start transition-colors cursor-pointer hover:bg-surface-2 ${
                        n.read ? "" : "bg-accent-soft/20 dark:bg-accent-soft/10"
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                          n.type === "order"
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400"
                            : n.type === "security"
                            ? "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400"
                            : "bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400"
                        }`}
                      >
                        <BellIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className={`text-[12.5px] truncate ${n.read ? "font-semibold text-primary" : "font-bold text-primary"}`}>
                            {t(n.titleKey)}
                          </h4>
                          <span className="text-[10px] text-tertiary shrink-0">
                            {translateTime(n.time)}
                          </span>
                        </div>
                        <p className="text-[12px] text-secondary mt-0.5 leading-normal line-clamp-2">
                          {t(n.bodyKey)}
                        </p>
                      </div>
                      {!n.read && (
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Cart Button (Desktop Only) */}
        <div className="hidden lg:flex items-center">
          <CartButton />
        </div>
      </div>
    </header>

      {/* Mobile Full Screen Drawer */}
      {showNotifications && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("notifications")}
          className="lg:hidden fixed inset-0 z-50 h-full w-full bg-surface flex flex-col animate-slide-up overflow-hidden"
        >
          {/* Header */}
          <div className="px-4.5 pb-3 pt-3 flex items-center justify-between border-b border-border bg-surface shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNotifications(false)}
                className="p-1 rounded-lg hover:bg-surface-2 text-secondary hover:text-primary cursor-pointer"
                aria-label={t("closeNotifications")}
              >
                <CloseIcon className="h-5 w-5" />
              </button>
              <h2 className="text-[15px] font-extrabold text-primary">
                {t("notifications")}
              </h2>
            </div>
            {notifications.length > 0 && (
              <div className="flex gap-2 text-xs">
                <button
                  onClick={handleMarkAllRead}
                  className="font-bold text-accent hover:text-accent-hover cursor-pointer"
                >
                  {t("markAllRead")}
                </button>
                <span className="text-tertiary">·</span>
                <button
                  onClick={handleClearAll}
                  className="font-bold text-danger hover:opacity-85 cursor-pointer"
                >
                  {t("clearAll")}
                </button>
              </div>
            )}
          </div>

          {/* Content List */}
          <div className="flex-1 overflow-y-auto divide-y divide-border bg-surface">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-secondary text-xs">
                {t("noNotifications")}
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationItemClick(n.id)}
                  className={`p-4 flex gap-3.5 text-start transition-colors cursor-pointer ${
                    n.read ? "" : "bg-accent-soft/20 dark:bg-accent-soft/10"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      n.type === "order"
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400"
                        : n.type === "security"
                        ? "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400"
                        : "bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400"
                    }`}
                  >
                    <BellIcon className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className={`text-[13px] ${n.read ? "font-semibold text-primary" : "font-extrabold text-primary"}`}>
                        {t(n.titleKey)}
                      </h4>
                      <span className="text-[10px] text-tertiary shrink-0">
                        {translateTime(n.time)}
                      </span>
                    </div>
                    <p className="text-[12.5px] text-secondary mt-0.5 leading-relaxed">
                      {t(n.bodyKey)}
                    </p>
                  </div>
                  {!n.read && (
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
