"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { CheckIcon, MailIcon } from "@/components/ui/icons";
import { forgotPasswordRequest } from "@/lib/auth/client";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setFormError(undefined);

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Email is required.");
      return;
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      setError("Enter a valid email address.");
      return;
    }

    setSubmitting(true);
    const result = await forgotPasswordRequest(trimmed);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.errors?.email);
      setFormError(result.errors?.form);
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <AuthCard
        title="Check your email"
        subtitle={`We've sent a password reset link to ${email.trim()}.`}
        footer={
          <Link href="/login" className="font-semibold text-accent hover:text-accent-hover">
            ← Back to sign in
          </Link>
        }
      >
        <div className="flex items-center justify-center gap-2.5 rounded-xl bg-success/10 px-4 py-3.5 text-sm font-medium text-success">
          <CheckIcon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
          Check your inbox for further instructions.
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset your password"
      subtitle="We'll email you a reset link"
      footer={
        <Link href="/login" className="font-semibold text-accent hover:text-accent-hover">
          ← Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {formError && <ErrorBanner message={formError} />}
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          error={error}
          iconStart={<MailIcon className="h-[17px] w-[17px]" aria-hidden="true" />}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" fullWidth size="lg" loading={submitting}>
          Send reset link
        </Button>
      </form>
    </AuthCard>
  );
}
