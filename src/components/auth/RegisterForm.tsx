"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { LockIcon, MailIcon, UserIcon } from "@/components/ui/icons";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useLanguage } from "@/lib/useLanguage";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  const { t } = useLanguage();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    if (!username.trim()) next.username = t("usernameRequired");
    if (!email.trim()) next.email = t("emailRequired");
    else if (!EMAIL_REGEX.test(email.trim())) next.email = t("enterValidEmail");
    if (!password) next.password = t("passwordRequired");
    else if (password.length < 8) next.password = t("useAtLeast8Chars");
    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    const result = await register(username.trim(), email.trim(), password);
    setSubmitting(false);

    if (!result.ok) {
      setErrors(result.errors ?? { form: t("somethingWentWrong") });
      return;
    }

    const next = searchParams.get("next");
    router.push(next && next.startsWith("/") ? next : "/account");
  }

  return (
    <AuthCard
      title={t("createYourAccount")}
      subtitle={t("joinLocalDeals")}
      footer={
        <>
          {t("alreadyHaveAccount")}{" "}
          <Link href="/login" className="font-semibold text-accent hover:text-accent-hover">
            {t("signIn")}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {errors.form && <ErrorBanner message={errors.form} />}

        <Input
          label={t("username")}
          placeholder={t("username")}
          className="text-left dir-ltr"
          autoComplete="username"
          required
          value={username}
          error={errors.username}
          iconStart={<UserIcon className="h-[17px] w-[17px]" aria-hidden="true" />}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          label={t("email")}
          placeholder={t("email")}
          className="text-left dir-ltr"
          type="email"
          autoComplete="email"
          required
          value={email}
          error={errors.email}
          iconStart={<MailIcon className="h-[17px] w-[17px]" aria-hidden="true" />}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label={t("password")}
          placeholder={t("password")}
          className="text-left dir-ltr"
          type="password"
          autoComplete="new-password"
          required
          hint={errors.password ? undefined : t("atLeast8Chars")}
          error={errors.password}
          value={password}
          iconStart={<LockIcon className="h-[17px] w-[17px]" aria-hidden="true" />}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" fullWidth size="lg" loading={submitting}>
          {t("createAccount")}
        </Button>
      </form>
    </AuthCard>
  );
}
