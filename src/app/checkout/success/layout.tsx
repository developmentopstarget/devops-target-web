import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
