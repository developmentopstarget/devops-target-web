"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { useLanguage } from "@/lib/useLanguage";

export function BuildPCBanner() {
  const { t } = useLanguage();

  return (
    <section id="build-a-pc" className="scroll-mt-20 py-10 lg:py-14">
      <Container>
        <div className="grid gap-4 rounded-2xl bg-gradient-to-r from-accent to-accent-hover p-7 text-white shadow-md md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-[22px] font-extrabold tracking-tight">
              {t("buildDreamPC")}
            </h2>
            <p className="mt-2 max-w-[48ch] text-sm opacity-90">
              {t("buildDreamPCDesc")}
            </p>
          </div>
          <Button as="a" href="/products" variant="onAccent" size="lg" className="w-max">
            {t("startYourBuild")}
          </Button>
        </div>
      </Container>
    </section>
  );
}
