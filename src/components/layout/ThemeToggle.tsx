"use client";

import { useTheme } from "next-themes";
import { IconButton } from "@/components/ui/IconButton";
import { MoonIcon, SunIcon } from "@/components/ui/icons";
import { useMounted } from "@/lib/useMounted";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <IconButton
      label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      icon={
        isDark ? (
          <MoonIcon className="h-[19px] w-[19px]" aria-hidden="true" />
        ) : (
          <SunIcon className="h-[19px] w-[19px]" aria-hidden="true" />
        )
      }
      onClick={() => setTheme(isDark ? "light" : "dark")}
    />
  );
}
