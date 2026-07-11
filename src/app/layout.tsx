import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Vazirmatn } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { CartProvider } from "@/components/commerce/CartProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazir",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "DevOps Target — Laptops, PCs & Components",
    template: "%s | DevOps Target",
  },
  description:
    "Springfield's local computer store — laptops, custom PCs, and components with same-day pickup, free local delivery, and expert in-store service.",
  keywords: [
    "computer store",
    "laptops",
    "custom PC",
    "PC components",
    "PC repair",
    "Springfield computer shop",
  ],
  authors: [{ name: "DevOps Target" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "DevOps Target",
    title: "DevOps Target — Laptops, PCs & Components",
    description:
      "Springfield's local computer store — laptops, custom PCs, and components with same-day pickup, free local delivery, and expert in-store service.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevOps Target — Laptops, PCs & Components",
    description:
      "Springfield's local computer store — laptops, custom PCs, and components with same-day pickup, free local delivery, and expert in-store service.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${inter.variable} ${jetbrainsMono.variable} ${vazirmatn.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="max-w-full overflow-x-hidden flex flex-col bg-bg text-primary">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthProvider>
            <CartProvider>
              <ToastProvider>
                <div className="flex-1 flex flex-col pt-14 pb-16">
                  {children}
                </div>
                <MobileBottomNav />
              </ToastProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
