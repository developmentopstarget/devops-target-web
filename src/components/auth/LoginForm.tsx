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

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!identifier.trim()) nextErrors.identifier = "Enter your email or username.";
    if (!password) nextErrors.password = "Enter your password.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    const result = await login(identifier.trim(), password, rememberMe);
    setSubmitting(false);

    if (!result.ok) {
      setErrors(result.errors ?? { form: "Something went wrong. Please try again." });
      return;
    }

    const next = searchParams.get("next");
    router.push(next && next.startsWith("/") ? next : "/account");
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your account"
      footer={
        <>
          New here?{" "}
          <Link href="/register" className="font-semibold text-accent hover:text-accent-hover">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {errors.form && <ErrorBanner message={errors.form} />}

        <Input
          label="Email or username"
          autoComplete="username"
          required
          value={identifier}
          error={errors.identifier || errors.username}
          iconStart={<UserIcon className="h-[17px] w-[17px]" aria-hidden="true" />}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          error={errors.password}
          iconStart={<LockIcon className="h-[17px] w-[17px]" aria-hidden="true" />}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="-mt-1.5 flex items-center justify-between text-[12.5px]">
          <label className="flex items-center gap-1.75 font-medium text-secondary">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-3.75 w-3.75 accent-accent"
            />
            Remember me
          </label>
          <Link href="/forgot-password" className="font-semibold text-accent hover:text-accent-hover">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth size="lg" loading={submitting}>
          Sign in
        </Button>
      </form>
    </AuthCard>
  );
}
