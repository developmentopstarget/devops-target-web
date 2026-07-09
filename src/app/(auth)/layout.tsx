import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthRouteLayout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
