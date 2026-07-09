"use client";

import { Button } from "@/components/ui/Button";
import { ClockIcon, MapPinIcon, PhoneIcon } from "@/components/ui/icons";
import { Container } from "@/components/layout/Container";
import { storeConfig } from "@/config/store";
import { useLanguage } from "@/lib/useLanguage";

export function StoreLocal() {
  const { t, lang } = useLanguage();
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(storeConfig.mapQuery)}`;

  const visitUsTitle = t("visitUsIn").replace("{city}", lang === "fa" ? "اسپرینگ‌فیلد" : storeConfig.city);
  const storeMapTitle = t("storeMap").replace("{city}", lang === "fa" ? "اسپرینگ‌فیلد" : storeConfig.city);

  return (
    <section id="store-local" className="scroll-mt-20 py-10 lg:py-14">
      <Container>
        <div className="grid gap-4.5 md:grid-cols-2 md:items-stretch">
          <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
            <h2 className="text-[19px] font-bold text-primary">
              {visitUsTitle}
            </h2>
            <p className="mt-1 text-[13.5px] text-secondary">
              {t("talkRealTech")}
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              <li className="flex gap-2.75 text-[13.5px] text-secondary">
                <MapPinIcon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-accent" aria-hidden="true" />
                <span>
                  <b className="font-semibold text-primary">{t("address")}:</b>{" "}
                  {lang === "fa" ? "خیابان اصلی ۱۲۳، اسپرینگ‌فیلد" : `${storeConfig.address.line1}, ${storeConfig.address.city}`}
                </span>
              </li>
              <li className="flex gap-2.75 text-[13.5px] text-secondary">
                <PhoneIcon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-accent" aria-hidden="true" />
                <span>
                  <b className="font-semibold text-primary">{t("phone")}:</b>{" "}
                  <a href={`tel:${storeConfig.phoneHref}`} className="font-mono hover:text-primary">
                    {storeConfig.phone}
                  </a>
                </span>
              </li>
              <li className="flex gap-2.75 text-[13.5px] text-secondary">
                <ClockIcon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-accent" aria-hidden="true" />
                <span>
                  <b className="font-semibold text-primary">{t("hours")}:</b>{" "}
                  {lang === "fa" ? "شنبه تا چهارشنبه ۹ تا ۱۷" : storeConfig.hoursSummary}
                </span>
              </li>
            </ul>
            <Button as="a" href={mapsHref} variant="secondary" className="mt-4.5 w-max">
              {t("getDirections")}
            </Button>
          </div>
          <div
            className="grid min-h-50 place-items-center rounded-xl border border-border text-[13px] font-semibold text-tertiary"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, var(--surface-2), var(--surface-2) 12px, var(--surface) 12px, var(--surface) 24px)",
            }}
          >
            {storeMapTitle}
          </div>
        </div>
      </Container>
    </section>
  );
}
