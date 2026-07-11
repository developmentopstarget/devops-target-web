"use client";

import Link from "next/link";
import Image from "next/image";

export function MobileNavbar() {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center"
    >
      <Image
        src="/assets/images/niavaran-computer-logo.png"
        alt="Niavaran Computer Logo"
        width={130}
        height={26}
        className="h-6.5 w-auto object-contain"
        priority
      />
    </Link>
  );
}
