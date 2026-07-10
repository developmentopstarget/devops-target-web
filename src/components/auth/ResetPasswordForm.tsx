"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { CheckIcon, LockIcon } from "@/components/ui/icons";
import { resetPasswordConfirmRequest } from "@/lib/auth/client";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (!uid || !token) {
    return (
      <AuthCard
        title="Reset link invalid"
        subtitle="This password reset link is invalid or has expired."
        footer={
          <Link href="/forgot-password" className="font-semibold text-accent hover:text-accent-hover">
            Request a new link
          </Link>
        }
      >
        <ErrorBanner message="Please request a new password reset email." />
      </AuthCard>
    );
  }

  if (done) {
    return (
      <AuthCard
        title="Password updated"
        subtitle="Your password has been reset."
        footer={
          <Link href="/login" className="font-semibold text-accent hover:text-accent-hover">
            Sign in
          </Link>
        }
      >
        <div className="flex items-center justify-center gap-2.5 rounded-xl bg-success/10 px-4 py-3.5 text-sm font-medium text-success">
          <CheckIcon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
          You can now sign in with your new password.
        </div>
      </AuthCard>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!password) nextErrors.password = "Password is required.";
    else if (password.length < 8) nextErrors.password = "Use at least 8 characters.";
    if (confirmPassword !== password) nextErrors.confirmPassword = "Passwords do not match.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    const result = await resetPasswordConfirmRequest(uid as string, token as string, password);
    setSubmitting(false);

    if (!result.ok) {
      setErrors(result.errors ?? { form: "Something went wrong. Please try again." });
      return;
    }

    setDone(true);
  }

  return (
    <AuthCard title="Set a new password" subtitle="Choose a new password for your account">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {errors.form && <ErrorBanner message={errors.form} />}
        <Input
          label="New password"
          type="password"
          className="text-left dir-ltr"
          autoComplete="new-password"
          required
          value={password}
          error={errors.password}
          iconStart={<LockIcon className="h-[17px] w-[17px]" aria-hidden="true" />}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          label="Confirm new password"
          type="password"
          className="text-left dir-ltr"
          autoComplete="new-password"
          required
          value={confirmPassword}
          error={errors.confirmPassword}
          iconStart={<LockIcon className="h-[17px] w-[17px]" aria-hidden="true" />}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button type="submit" fullWidth size="lg" loading={submitting}>
          Reset password
        </Button>
      </form>
    </AuthCard>
  );
}
