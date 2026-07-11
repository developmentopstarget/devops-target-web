"use client";

import Link from "next/link";
import Image from "next/image";
import { iconButtonClassName } from "@/components/ui/IconButton";
import { BellIcon, UserIcon } from "@/components/ui/icons";
import { Container } from "@/components/layout/Container";
import { SearchBar } from "@/components/layout/SearchBar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { CartButton } from "@/components/layout/CartButton";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import { useLanguage } from "@/lib/useLanguage";
import { useState, useEffect } from "react";
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
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-surface border-b flex items-center max-w-full flex-row dir-ltr">
      {/* Mobile Drawer is hidden on mobile screens now, but keep it on desktop (though hidden there too by Tailwind usually) */}
      <div className="hidden">
        <MobileDrawer />
      </div>

      {/* Mobile Header Row */}
      <div className="relative flex lg:hidden items-center justify-between w-full gap-2 px-4">
        <SearchBar className="flex-1 max-w-full" />
        
        <div className="flex items-center gap-1.5">
          {/* Language Toggle */}
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

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notification Bell */}
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
          </div>
        </div>

        {/* Mobile Notification Floating Dropdown */}
        {showNotifications && (
          <>
            {/* Tap-to-Close Outside Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-transparent"
              onClick={() => setShowNotifications(false)}
            />
            {/* Dropdown Card */}
            <div className="absolute top-full right-2 left-2 mt-3 max-w-[calc(100vw-16px)] bg-surface border rounded-lg shadow-xl z-50 overflow-hidden">
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
          </>
        )}
      </div>

      {/* Desktop Header Row: strict LTR layout track centered with Container */}
      <Container className="hidden lg:flex flex-row dir-ltr items-center justify-between w-full gap-3 h-full">
        {/* Left-to-right locked layout track: [Logo/Icon] -> [Brand Name] -> [Shop Link] */}
        <div className="flex flex-row dir-ltr items-center gap-3">
          <Link
            href="/"
            className="flex shrink-0 items-center"
          >
            <Image
              src="/assets/images/niavaran-computer-logo.png"
              alt="Niavaran Computer Logo"
              width={160}
              height={32}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>

          <Link
            href="/products"
            className="rounded-lg px-3 py-2 text-[13.5px] font-semibold text-secondary hover:bg-surface-2 hover:text-primary whitespace-nowrap"
          >
            {t("shop")}
          </Link>
        </div>

        {/* SearchBar box container */}
        <SearchBar className="flex-1 max-w-[420px]" />

        {/* Right track: [Language Icon Toggle] -> [Theme Dark/Light Button] -> [Notification Bell Icon] -> [Cart Drawer Icon] -> [Profile User Icon Link] */}
        <div className="flex flex-row dir-ltr items-center gap-1.5">
          {/* Language Toggle */}
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

          {/* Theme Button */}
          <ThemeToggle />

          {/* Notification Bell Icon */}
          <div className="relative notification-container flex items-center justify-center h-full">
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
              <div className="absolute top-full right-0 mt-3 w-80 bg-surface border rounded-lg shadow-lg z-50 overflow-hidden">
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

          {/* Cart Drawer Icon */}
          <CartButton />

          {/* Profile User Icon Link */}
          <Link
            href="/account"
            className={iconButtonClassName()}
            title={t("profile")}
            aria-label={t("profile")}
          >
            <UserIcon className="h-[19px] w-[19px]" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </header>

    </>
  );
}
