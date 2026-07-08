import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { storeConfig } from "@/config/store";

export function BuildPCBanner() {
  return (
    <section id="build-a-pc" className="scroll-mt-20 py-10 lg:py-14">
      <Container>
        <div className="grid gap-4 rounded-2xl bg-gradient-to-r from-accent to-accent-hover p-7 text-white shadow-md md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-[22px] font-extrabold tracking-tight">
              Build your dream PC with local experts
            </h2>
            <p className="mt-2 max-w-[48ch] text-sm opacity-90">
              Tell us your budget and use case — gaming, editing, dev, or office. We&rsquo;ll spec
              it, build it, stress-test it, and have it ready for pickup in {storeConfig.city}.
            </p>
          </div>
          <Button as="a" href="/products" variant="onAccent" size="lg" className="w-max">
            Start your build
          </Button>
        </div>
      </Container>
    </section>
  );
}
