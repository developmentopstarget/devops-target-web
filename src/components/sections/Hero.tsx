import { Button } from "@/components/ui/Button";
import { CheckIcon, LaptopIcon } from "@/components/ui/icons";
import { PriceTag } from "@/components/commerce/PriceTag";
import { storeConfig } from "@/config/store";
import { dealsOfTheWeek, featuredDealSlug } from "@/data/products";

const trustPoints = [
  "Same-day in-store pickup",
  `Free local delivery over $${storeConfig.freeDeliveryThreshold}`,
  "1-year local warranty & support",
];

export function Hero() {
  const featured = dealsOfTheWeek.find((product) => product.slug === featuredDealSlug);

  return (
    <section className="pt-9 pb-2">
      <div className="mx-auto grid w-full max-w-7xl gap-7 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <span className="inline-flex w-max items-center gap-1.5 rounded-full bg-accent-soft px-2.75 py-1.5 text-[11px] font-bold uppercase tracking-wide text-accent">
            <span aria-hidden="true">📍</span>
            {storeConfig.tagline}
          </span>
          <h1 className="mt-4 mb-3 text-[28px] font-extrabold leading-[1.12] tracking-tight text-primary sm:text-[32px]">
            Laptops, custom PCs &amp; components — built right, in stock, near you.
          </h1>
          <p className="max-w-[52ch] text-[15.5px] text-secondary">
            Shop trusted brands with real prices, or let our in-store techs build and service your
            machine. Same-day pickup and free local delivery across {storeConfig.city}.
          </p>
          <div className="mt-5.5 flex flex-wrap gap-3">
            <Button as="a" href="/products" size="lg">
              Shop laptops &amp; PCs
            </Button>
            <Button as="a" href="#build-a-pc" variant="secondary" size="lg">
              Build a custom PC
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3.5">
            {trustPoints.map((point) => (
              <span key={point} className="flex items-center gap-2 text-[13px] font-medium text-secondary">
                <span className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-[7px] bg-success/15 text-success">
                  <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                {point}
              </span>
            ))}
          </div>
        </div>

        {featured && (
          <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface-2 to-surface p-5 shadow-md">
            <span className="absolute top-4 end-4 rounded-full bg-danger px-2.5 py-1.25 text-[11px] font-bold text-white">
              Deal of the week
            </span>
            <div className="grid aspect-[16/11] place-items-center gap-1.5 rounded-xl border border-border bg-[radial-gradient(120%_120%_at_20%_0,var(--accent-soft),transparent_55%)] bg-bg text-[13px] text-tertiary">
              <LaptopIcon className="h-14 w-14 text-border-strong" aria-hidden="true" />
              In-store demo unit
            </div>
            <div className="mt-3.5 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-primary">{featured.name}</div>
                <div className="text-xs text-secondary">{featured.spec}</div>
              </div>
              <PriceTag amount={featured.price} compareAt={featured.compareAtPrice} size="lg" className="text-end" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
