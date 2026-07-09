import { Input } from "@/components/ui/Input";
import { CheckoutStepCard } from "@/components/commerce/CheckoutStepCard";

export interface ContactStepProps {
  email: string;
  onEmailChange: (email: string) => void;
  emailOptIn: boolean;
  onEmailOptInChange: (optIn: boolean) => void;
  error?: string;
}

export function ContactStep({ email, onEmailChange, emailOptIn, onEmailOptInChange, error }: ContactStepProps) {
  return (
    <CheckoutStepCard step={1} title="Contact">
      <Input
        type="email"
        label="Email"
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
        Email me order updates and local deals
      </label>
    </CheckoutStepCard>
  );
}
