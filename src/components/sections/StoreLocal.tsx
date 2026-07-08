import { Button } from "@/components/ui/Button";
import { ClockIcon, MapPinIcon, PhoneIcon } from "@/components/ui/icons";
import { Container } from "@/components/layout/Container";
import { storeConfig } from "@/config/store";

export function StoreLocal() {
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(storeConfig.mapQuery)}`;

  return (
    <section id="store-local" className="scroll-mt-20 py-10 lg:py-14">
      <Container>
        <div className="grid gap-4.5 md:grid-cols-2 md:items-stretch">
          <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
            <h2 className="text-[19px] font-bold text-primary">
              Visit us in <span className="text-accent">{storeConfig.city}</span>
            </h2>
            <p className="mt-1 text-[13.5px] text-secondary">
              Talk to a real technician, test devices in person, or pick up your order.
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              <li className="flex gap-2.75 text-[13.5px] text-secondary">
                <MapPinIcon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-accent" aria-hidden="true" />
                <span>
                  <b className="font-semibold text-primary">Address:</b> {storeConfig.address.line1},{" "}
                  {storeConfig.address.city}
                </span>
              </li>
              <li className="flex gap-2.75 text-[13.5px] text-secondary">
                <PhoneIcon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-accent" aria-hidden="true" />
                <span>
                  <b className="font-semibold text-primary">Phone:</b>{" "}
                  <a href={`tel:${storeConfig.phoneHref}`} className="font-mono hover:text-primary">
                    {storeConfig.phone}
                  </a>
                </span>
              </li>
              <li className="flex gap-2.75 text-[13.5px] text-secondary">
                <ClockIcon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-accent" aria-hidden="true" />
                <span>
                  <b className="font-semibold text-primary">Hours:</b> {storeConfig.hoursSummary}
                </span>
              </li>
            </ul>
            <Button as="a" href={mapsHref} variant="secondary" className="mt-4.5 w-max">
              Get directions
            </Button>
          </div>
          <div
            className="grid min-h-50 place-items-center rounded-xl border border-border text-[13px] font-semibold text-tertiary"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, var(--surface-2), var(--surface-2) 12px, var(--surface) 12px, var(--surface) 24px)",
            }}
          >
            Store map — {storeConfig.city}
          </div>
        </div>
      </Container>
    </section>
  );
}
