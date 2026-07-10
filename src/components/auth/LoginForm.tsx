"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { LockIcon, UserIcon } from "@/components/ui/icons";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useLanguage } from "@/lib/useLanguage";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { t, lang } = useLanguage();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!identifier.trim()) nextErrors.identifier = t("enterEmailOrUsername");
    if (!password) nextErrors.password = t("enterPassword");
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    const result = await login(identifier.trim(), password, rememberMe);
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
      title={t("welcomeBack")}
      subtitle={t("signInAccount")}
      footer={
        <>
          {t("newHere")}{" "}
          <Link href="/register" className="font-semibold text-accent hover:text-accent-hover">
            {t("createAccount")}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {errors.form && <ErrorBanner message={errors.form} />}

        <Input
          label={t("emailOrUsername")}
          placeholder={t("emailOrUsername")}
          className="text-left dir-ltr"
          autoComplete="username"
          required
          value={identifier}
          error={errors.identifier || errors.username}
          iconStart={<UserIcon className="h-[17px] w-[17px]" aria-hidden="true" />}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <Input
          label={t("password")}
          placeholder={t("password")}
          className="text-left dir-ltr"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          error={errors.password}
          iconStart={<LockIcon className="h-[17px] w-[17px]" aria-hidden="true" />}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div
          dir={lang === "fa" ? "rtl" : "ltr"}
          className={[
            "-mt-1.5 flex items-center justify-between text-[12.5px]",
            lang === "fa" ? "dir-rtl" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <label className="flex items-center gap-1.75 font-medium text-secondary">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-3.75 w-3.75 accent-accent"
            />
            {t("rememberMe")}
          </label>
          <Link href="/forgot-password" className="font-semibold text-accent hover:text-accent-hover">
            {t("forgotPassword")}
          </Link>
        </div>

        <Button type="submit" fullWidth size="lg" loading={submitting}>
          {t("signIn")}
        </Button>
      </form>
    </AuthCard>
  );
}
