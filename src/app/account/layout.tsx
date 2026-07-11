"use client";

import { useAuth } from "@/lib/auth/AuthProvider";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/layout/Container";
import { useLanguage } from "@/lib/useLanguage";
import {
  UserIcon,
  MapPinIcon,
  TruckIcon,
  ShieldCheckIcon,
  HeartIcon,
  DollarIcon,
} from "@/components/ui/icons";

// Simple Log Out Icon
function LogOutIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

interface AccountLayoutProps {
  children: React.ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();

  useEffect(() => {
    // If auth state is fully loaded and there is no user, redirect to login
    if (!loading && !user) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
            <p className="text-sm text-secondary font-medium animate-pulse">{t("loadingSession")}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!user) {
    return null; // Let the redirect trigger in useEffect
  }

  // Get user initials for avatar
  const initials = user.username
    ? user.username.substring(0, 2).toUpperCase()
    : (user.email ? user.email.substring(0, 2).toUpperCase() : "U");

  const menuItems = [
    {
      labelKey: "profileAndSettings" as const,
      href: "/account",
      icon: <UserIcon className="h-4.5 w-4.5" />,
      exact: true,
    },
    {
      labelKey: "orderHistory" as const,
      href: "/account/orders",
      icon: <TruckIcon className="h-4.5 w-4.5" />,
      exact: false,
    },
    {
      labelKey: "quotes" as const,
      href: "/account/quotes",
      icon: <DollarIcon className="h-4.5 w-4.5" />,
      exact: false,
    },
    {
      labelKey: "myAddresses" as const,
      href: "/account/addresses",
      icon: <MapPinIcon className="h-4.5 w-4.5" />,
      exact: false,
    },
    {
      labelKey: "security2FA" as const,
      href: "/account/security",
      icon: <ShieldCheckIcon className="h-4.5 w-4.5" />,
      exact: false,
    },
    {
      labelKey: "wishlist" as const,
      href: "/account/wishlist",
      icon: <HeartIcon className="h-4.5 w-4.5" />,
      exact: false,
    },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-bg overflow-x-hidden">
        <Container>
          <div className="flex flex-col gap-6 w-full lg:flex-row items-start py-4 lg:py-6">
            
            {/* Sidebar / Navigation Shell */}
            <aside className="w-full lg:w-64 flex flex-col gap-6 shrink-0">
              
              {/* User Profile Summary Card */}
              <Card className="overflow-hidden border border-border">
                <div className="flex items-center gap-4 p-1">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-accent to-accent-hover text-white text-base font-bold shadow-sm">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-[15px] font-bold text-primary">
                      {user.username || t("profile")}
                    </h2>
                    <p className="truncate text-xs text-secondary">{user.email}</p>
                  </div>
                </div>
              </Card>

              {/* Navigation Links Card */}
              <Card className="p-1.5 border border-border">
                <nav className="w-full lg:w-64 flex flex-col space-y-1" aria-label="Account Navigation">
                  {menuItems.map((item) => {
                    const isActive = item.exact
                      ? pathname === item.href
                      : pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={[
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-semibold transition-all whitespace-nowrap",
                          isActive
                            ? "bg-accent-soft text-accent shadow-sm"
                            : "text-secondary hover:bg-surface-2 hover:text-primary",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {item.icon}
                        <span>{t(item.labelKey)}</span>
                      </Link>
                    );
                  })}
                  <div className="my-2 border-t border-border" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-semibold text-danger hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <LogOutIcon className="h-4.5 w-4.5" />
                    <span>{t("signOut")}</span>
                  </button>
                </nav>
              </Card>
            </aside>

            {/* Sub-route Content Area / Content Layout Shell */}
            <div className="lg:flex-1 min-w-0 w-full">
              {children}
            </div>

          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
