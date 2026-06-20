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
    default: "Agency — Premium Digital Studio",
    template: "%s | Agency",
  },
  description:
    "We craft exceptional digital experiences — strategy, design, and engineering for ambitious brands.",
  keywords: ["digital agency", "web design", "branding", "development", "UI/UX"],
  authors: [{ name: "Agency" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Agency",
    title: "Agency — Premium Digital Studio",
    description:
      "We craft exceptional digital experiences — strategy, design, and engineering for ambitious brands.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agency — Premium Digital Studio",
    description:
      "We craft exceptional digital experiences — strategy, design, and engineering for ambitious brands.",
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
