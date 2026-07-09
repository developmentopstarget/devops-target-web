"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { OtpInput } from "@/components/auth/OtpInput";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ShieldIcon } from "@/components/ui/icons";
import { verify2faRequest } from "@/lib/auth/client";

const RESEND_COOLDOWN_SECONDS = 30;

export function Verify2FAForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [code, setCode] = useState("");
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [backupCode, setBackupCode] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  async function submitCode(value: string) {
    setError(undefined);
    setSubmitting(true);
    const result = await verify2faRequest(value);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.errors?.form ?? "That code didn't work. Please try again.");
      return;
    }

    const next = searchParams.get("next");
    router.push(next && next.startsWith("/") ? next : "/account");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = useBackupCode ? backupCode.trim() : code;

    if (!value || (!useBackupCode && value.length < 6)) {
      setError(useBackupCode ? "Enter your backup code." : "Enter the 6-digit code.");
      return;
    }

    void submitCode(value);
  }

  function handleResend() {
    setCooldown(RESEND_COOLDOWN_SECONDS);
    // TODO(2fa): call the real resend-code endpoint once django-otp lands.
  }

  return (
    <AuthCard
      title="Two-factor authentication"
      subtitle={
        useBackupCode ? "Enter one of your backup codes" : "Enter the 6-digit code from your authenticator app"
      }
      footer={
        useBackupCode ? (
          <button
            type="button"
            className="font-semibold text-accent hover:text-accent-hover"
            onClick={() => setUseBackupCode(false)}
          >
            Use authenticator code instead
          </button>
        ) : (
          <>
            Didn&apos;t get a code?{" "}
            <button
              type="button"
              disabled={cooldown > 0}
              onClick={handleResend}
              className="font-semibold text-accent hover:text-accent-hover disabled:pointer-events-none disabled:text-tertiary"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend"}
            </button>{" "}
            ·{" "}
            <button
              type="button"
              className="font-semibold text-accent hover:text-accent-hover"
              onClick={() => setUseBackupCode(true)}
            >
              Use a backup code
            </button>
          </>
        )
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {!useBackupCode && (
          <div className="flex items-start gap-2 rounded-xl bg-accent-soft px-3 py-2.5 text-xs text-secondary">
            <ShieldIcon className="mt-0.5 h-[15px] w-[15px] shrink-0 text-accent" aria-hidden="true" />
            Open your authenticator app (or check your SMS) for the current code.
          </div>
        )}

        {useBackupCode ? (
          <Input
            label="Backup code"
            autoComplete="one-time-code"
            required
            value={backupCode}
            error={error}
            onChange={(e) => setBackupCode(e.target.value)}
          />
        ) : (
          <OtpInput
            value={code}
            onChange={setCode}
            onComplete={(value) => void submitCode(value)}
            disabled={submitting}
            error={error}
          />
        )}

        <Button type="submit" fullWidth size="lg" loading={submitting}>
          Verify
        </Button>
      </form>
    </AuthCard>
  );
}
