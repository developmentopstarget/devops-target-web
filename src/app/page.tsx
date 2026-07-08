import type { Metadata } from "next";
import { CartProvider } from "@/components/commerce/CartProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Hero } from "@/components/sections/Hero";
import { CategoryTiles } from "@/components/sections/CategoryTiles";
import { Deals } from "@/components/sections/Deals";
import { ValueProps } from "@/components/sections/ValueProps";
import { BuildPCBanner } from "@/components/sections/BuildPCBanner";
import { StoreLocal } from "@/components/sections/StoreLocal";
import { Newsletter } from "@/components/sections/Newsletter";
import { JsonLd } from "@/components/seo/JsonLd";
import { storeConfig } from "@/config/store";

export async function generateMetadata(): Promise<Metadata> {
  const description = `${storeConfig.city}'s local computer store — laptops, custom PCs, and components with same-day pickup, free local delivery over $${storeConfig.freeDeliveryThreshold}, and expert in-store service.`;

  return {
    description,
    openGraph: { description },
    twitter: { description },
  };
}

export default function Home() {
  return (
    <CartProvider>
      <ToastProvider>
        <JsonLd />
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1">
          <Hero />
          <CategoryTiles />
          <Deals />
          <ValueProps />
          <BuildPCBanner />
          <StoreLocal />
          <Newsletter />
        </main>
        <Footer />
        <MobileBottomNav />
      </ToastProvider>
    </CartProvider>
  );
}
