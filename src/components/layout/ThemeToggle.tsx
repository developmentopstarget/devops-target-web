"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { IconButton } from "@/components/ui/IconButton";
import { MoonIcon, SunIcon } from "@/components/ui/icons";

const noopSubscribe = () => () => {};

// Reports false on the server and on the client's first (hydration) render,
// then true afterwards — avoids a theme flash without a setState-in-effect.
function useMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

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
