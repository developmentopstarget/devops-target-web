import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DevOps Target — AI Automation & Web Development",
    template: "%s | DevOps Target",
  },
  description:
    "AI automation, web development, and technical operations for businesses that need things built right and running reliably.",
  keywords: [
    "AI automation",
    "web development",
    "DevOps",
    "workflow automation",
    "technical operations",
    "API integration",
    "infrastructure",
  ],
  authors: [{ name: "DevOps Target" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "DevOps Target",
    title: "DevOps Target — AI Automation & Web Development",
    description:
      "AI automation, web development, and technical operations for businesses that need things built right and running reliably.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevOps Target — AI Automation & Web Development",
    description:
      "AI automation, web development, and technical operations for businesses that need things built right and running reliably.",
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
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0f] text-[#f0f0f5]">
        {children}
      </body>
    </html>
  );
}
