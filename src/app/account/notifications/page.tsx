"use client";

import { useToast } from "@/components/ui/Toast";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState";
import { useState } from "react";

// Simple Bell Icon
function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

interface NotificationItem {
  id: number;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: "order" | "security" | "promo";
}

export default function NotificationsPage() {
  const toast = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      title: "Order Paid & Confirmed",
      body: "Your order DT-893012 has been successfully paid and is currently processing in our warehouse.",
      time: "2 hours ago",
      read: false,
      type: "order",
    },
    {
      id: 2,
      title: "Security Alert: Login from New Device",
      body: "A new login was detected from Springfield IP 192.168.1.100. If this wasn't you, change your password immediately.",
      time: "1 day ago",
      read: true,
      type: "security",
    },
    {
      id: 3,
      title: "Special Offer: 10% Off PC Parts",
      body: "Use promo code BUILD10 at checkout to save 10% on all components this week.",
      time: "3 days ago",
      read: true,
      type: "promo",
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.show("All notifications marked as read.", "success");
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.show("Notifications cleared.", "info");
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
          { label: "Notifications", href: "/account/notifications" },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-primary">
            Notifications Center
          </h1>
          <p className="text-[13px] text-secondary">
            Stay updated with your orders, security alerts, and exclusive promos.
          </p>
        </div>
        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              className="text-[12px] font-bold text-accent hover:text-accent-hover cursor-pointer"
            >
              Mark all as read
            </button>
            <span className="text-tertiary">·</span>
            <button
              onClick={handleClearAll}
              className="text-[12px] font-bold text-danger hover:opacity-80 cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={<BellIcon className="h-6 w-6 text-tertiary" />}
          title="Inbox is clean"
          description="You don't have any notifications at the moment."
          className="py-16"
        />
      ) : (
        <Card className="divide-y divide-border overflow-hidden border border-border p-0">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`flex items-start gap-4 p-4.5 transition-colors ${
                item.read ? "bg-surface" : "bg-accent-soft/30 dark:bg-accent-soft/10"
              }`}
            >
              <div
                className={`mt-1 flex h-8 w-8 items-center justify-center rounded-lg ${
                  item.type === "order"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400"
                    : item.type === "security"
                    ? "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400"
                    : "bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400"
                }`}
              >
                <BellIcon className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-4">
                  <h3
                    className={`text-[13.5px] truncate ${
                      item.read ? "font-bold text-primary" : "font-extrabold text-primary"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <span className="shrink-0 text-[10.5px] font-medium text-secondary">
                    {item.time}
                  </span>
                </div>
                <p className="text-[13px] text-secondary mt-1 leading-relaxed">
                  {item.body}
                </p>
              </div>
              {!item.read && (
                <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              )}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
