"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { CheckIcon, MailIcon } from "@/components/ui/icons";
import { forgotPasswordRequest } from "@/lib/auth/client";
import { useLanguage } from "@/lib/useLanguage";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordForm() {
  const { t } = useLanguage();
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
      setError(t("emailRequired"));
      return;
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      setError(t("enterValidEmail"));
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
        title={t("checkYourEmail")}
        subtitle={t("sentResetLinkTo").replace("{email}", email.trim())}
        footer={
          <Link href="/login" className="font-semibold text-accent hover:text-accent-hover">
            ← {t("backToSignIn")}
          </Link>
        }
      >
        <div className="flex items-center justify-center gap-2.5 rounded-xl bg-success/10 px-4 py-3.5 text-sm font-medium text-success">
          <CheckIcon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
          {t("checkInboxInstructions")}
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title={t("resetYourPassword")}
      subtitle={t("emailResetLink")}
      footer={
        <Link href="/login" className="font-semibold text-accent hover:text-accent-hover">
          ← {t("backToSignIn")}
        </Link>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {formError && <ErrorBanner message={formError} />}
        <Input
          label={t("email")}
          placeholder={t("email")}
          className="text-left dir-ltr"
          type="email"
          autoComplete="email"
          required
          value={email}
          error={error}
          iconStart={<MailIcon className="h-[17px] w-[17px]" aria-hidden="true" />}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" fullWidth size="lg" loading={submitting}>
          {t("sendResetLink")}
        </Button>
      </form>
    </AuthCard>
  );
}
