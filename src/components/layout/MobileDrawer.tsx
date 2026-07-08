"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { primaryNav } from "@/config/nav";

export function MobileDrawer() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <IconButton
        icon={<MenuIcon className="h-[19px] w-[19px]" aria-hidden="true" />}
        label="Open menu"
        onClick={() => setOpen(true)}
        className="lg:hidden"
      />
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-slate-950/50"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="absolute inset-y-0 start-0 flex w-[82%] max-w-80 flex-col gap-1.5 bg-surface p-4.5 shadow-lg"
          >
            <IconButton
              icon={<CloseIcon className="h-[18px] w-[18px]" aria-hidden="true" />}
              label="Close menu"
              onClick={() => setOpen(false)}
              className="mb-1.5 self-end"
            />
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {primaryNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-[9px] px-3 py-3 text-[14.5px] font-semibold text-primary hover:bg-surface-2"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <Button
              as="a"
              href="/login"
              variant="primary"
              fullWidth
              className="mt-2"
              onClick={() => setOpen(false)}
            >
              Sign in
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
