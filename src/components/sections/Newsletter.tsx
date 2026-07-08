"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Container } from "@/components/layout/Container";

type NewsletterStatus = "idle" | "submitting" | "success" | "error";

export function Newsletter() {
  const [status, setStatus] = useState<NewsletterStatus>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    if (!email) return;

    setStatus("submitting");
    try {
      // Placeholder for the Django API newsletter endpoint.
      await new Promise((resolve, reject) => {
        window.setTimeout(() => (Math.random() > 0.1 ? resolve(undefined) : reject(new Error("failed"))), 900);
      });
      setStatus("success");
      event.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="py-10 lg:py-14">
      <Container>
        <div className="rounded-2xl border border-border bg-surface-2 px-5 py-7 text-center">
          <h2 className="text-xl font-extrabold tracking-tight text-primary">Get local deals first</h2>
          <p className="mx-auto mt-1.5 max-w-[44ch] text-[13.5px] text-secondary">
            New arrivals, in-store events, and local-only discounts. No spam.
          </p>
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-4.5 flex max-w-115 flex-wrap justify-center gap-2.5"
            noValidate
          >
            <Input
              type="email"
              name="email"
              placeholder="you@email.com"
              aria-label="Email"
              required
              disabled={status === "submitting"}
              wrapperClassName="min-w-50 flex-1"
              className="h-11.5"
            />
            <Button type="submit" size="lg" loading={status === "submitting"} disabled={status === "submitting"}>
              Subscribe
            </Button>
          </form>
          <div role="status" aria-live="polite" className="mt-3 min-h-5 text-sm font-medium">
            {status === "success" && <span className="text-success">You&rsquo;re subscribed — welcome aboard!</span>}
            {status === "error" && <span className="text-danger">Something went wrong. Please try again.</span>}
          </div>
        </div>
      </Container>
    </section>
  );
}
