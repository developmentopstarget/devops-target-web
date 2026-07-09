import type { ReactNode } from "react";

export function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="flex min-h-[100dvh] items-center justify-center bg-bg px-4 py-10">{children}</div>;
}
