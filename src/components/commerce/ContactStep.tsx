import { Input } from "@/components/ui/Input";
import { CheckoutStepCard } from "@/components/commerce/CheckoutStepCard";
import { useLanguage } from "@/lib/useLanguage";

export interface ContactStepProps {
  email: string;
  onEmailChange: (email: string) => void;
  emailOptIn: boolean;
  onEmailOptInChange: (optIn: boolean) => void;
  error?: string;
}

export function ContactStep({ email, onEmailChange, emailOptIn, onEmailOptInChange, error }: ContactStepProps) {
  const { t } = useLanguage();

  return (
    <CheckoutStepCard step={1} title={t("contact")}>
      <Input
        type="email"
        label={t("email")}
        placeholder="you@email.com"
        autoComplete="email"
        required
        value={email}
        error={error}
        onChange={(e) => onEmailChange(e.target.value)}
      />
      <label className="mt-3 flex items-center gap-2.25 text-[13px] text-secondary">
        <input
          type="checkbox"
          checked={emailOptIn}
          onChange={(e) => onEmailOptInChange(e.target.checked)}
          className="h-4 w-4 accent-accent"
        />
        {t("emailOptInLabel")}
      </label>
    </CheckoutStepCard>
  );
}
