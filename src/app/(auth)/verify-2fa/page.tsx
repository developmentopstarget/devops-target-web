import type { Metadata } from "next";
import { Suspense } from "react";
import { Verify2FAForm } from "@/components/auth/Verify2FAForm";

export const metadata: Metadata = { title: "Two-factor authentication" };

export default function Verify2FAPage() {
  return (
    <Suspense fallback={null}>
      <Verify2FAForm />
    </Suspense>
  );
}
