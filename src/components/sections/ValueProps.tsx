"use client";

import type { ReactElement } from "react";
import { DollarIcon, ShieldCheckIcon, ShieldIcon, TruckIcon, type IconProps } from "@/components/ui/icons";
import { Container } from "@/components/layout/Container";
import { useLanguage } from "@/lib/useLanguage";

interface ValueProp {
  icon: (props: IconProps) => ReactElement;
  titleKey: "sameDayPickupTitle" | "expertBuildTitle" | "localWarrantyTitle" | "priceMatchTitle";
  descKey: "sameDayPickupDesc" | "expertBuildDesc" | "localWarrantyDesc" | "priceMatchDesc";
}

const valueProps: ValueProp[] = [
  {
    icon: TruckIcon,
    titleKey: "sameDayPickupTitle",
    descKey: "sameDayPickupDesc",
  },
  {
    icon: ShieldCheckIcon,
    titleKey: "expertBuildTitle",
    descKey: "expertBuildDesc",
  },
  {
    icon: ShieldIcon,
    titleKey: "localWarrantyTitle",
    descKey: "localWarrantyDesc",
  },
  {
    icon: DollarIcon,
    titleKey: "priceMatchTitle",
    descKey: "priceMatchDesc",
  },
];

export function ValueProps() {
  const { t } = useLanguage();

  return (
    <section className="py-10 lg:py-14">
      <Container>
        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          {valueProps.map(({ icon: Icon, titleKey, descKey }) => (
            <div key={titleKey} className="rounded-xl border border-border bg-surface p-4.5 shadow-sm">
              <span className="mb-3 flex h-10.5 w-10.5 items-center justify-center rounded-[11px] bg-accent-soft text-accent">
                <Icon className="h-5.5 w-5.5" aria-hidden="true" />
              </span>
              <h3 className="mb-1 text-[14.5px] font-bold text-primary">{t(titleKey)}</h3>
              <p className="text-[12.5px] leading-relaxed text-secondary">{t(descKey)}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
