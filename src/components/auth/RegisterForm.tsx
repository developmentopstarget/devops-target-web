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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    if (!username.trim()) next.username = "Username is required.";
    if (!email.trim()) next.email = "Email is required.";
    else if (!EMAIL_REGEX.test(email.trim())) next.email = "Enter a valid email address.";
    if (!password) next.password = "Password is required.";
    else if (password.length < 8) next.password = "Use at least 8 characters.";
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
      setErrors(result.errors ?? { form: "Something went wrong. Please try again." });
      return;
    }

    const next = searchParams.get("next");
    router.push(next && next.startsWith("/") ? next : "/account");
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join for faster checkout & local deals"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-accent hover:text-accent-hover">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {errors.form && <ErrorBanner message={errors.form} />}

        <Input
          label="Username"
          autoComplete="username"
          required
          value={username}
          error={errors.username}
          iconStart={<UserIcon className="h-[17px] w-[17px]" aria-hidden="true" />}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          error={errors.email}
          iconStart={<MailIcon className="h-[17px] w-[17px]" aria-hidden="true" />}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          hint={errors.password ? undefined : "At least 8 characters."}
          error={errors.password}
          value={password}
          iconStart={<LockIcon className="h-[17px] w-[17px]" aria-hidden="true" />}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" fullWidth size="lg" loading={submitting}>
          Create account
        </Button>
      </form>
    </AuthCard>
  );
}
