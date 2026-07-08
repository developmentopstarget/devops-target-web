import type { ReactElement } from "react";
import { DollarIcon, ShieldCheckIcon, ShieldIcon, TruckIcon, type IconProps } from "@/components/ui/icons";
import { Container } from "@/components/layout/Container";

interface ValueProp {
  icon: (props: IconProps) => ReactElement;
  title: string;
  description: string;
}

const valueProps: ValueProp[] = [
  {
    icon: TruckIcon,
    title: "Same-day pickup",
    description: "Order online and collect from our store within hours.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Expert build & repair",
    description: "In-house technicians assemble, upgrade, and service every machine.",
  },
  {
    icon: ShieldIcon,
    title: "Local warranty",
    description: "1-year warranty handled in-store — no shipping your gear away.",
  },
  {
    icon: DollarIcon,
    title: "Price-match promise",
    description: "Find it cheaper locally? We'll match the price on the spot.",
  },
];

export function ValueProps() {
  return (
    <section className="py-10 lg:py-14">
      <Container>
        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          {valueProps.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-xl border border-border bg-surface p-4.5 shadow-sm">
              <span className="mb-3 flex h-10.5 w-10.5 items-center justify-center rounded-[11px] bg-accent-soft text-accent">
                <Icon className="h-5.5 w-5.5" aria-hidden="true" />
              </span>
              <h3 className="mb-1 text-[14.5px] font-bold text-primary">{title}</h3>
              <p className="text-[12.5px] leading-relaxed text-secondary">{description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
