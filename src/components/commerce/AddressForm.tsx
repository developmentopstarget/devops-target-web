import { Input } from "@/components/ui/Input";
import { CheckoutStepCard } from "@/components/commerce/CheckoutStepCard";
import type { CheckoutAddress, PickupContact } from "@/lib/checkout";
import { useLanguage } from "@/lib/useLanguage";

interface DeliveryVariantProps {
  variant: "delivery";
  value: CheckoutAddress;
  onChange: (value: CheckoutAddress) => void;
  errors?: Partial<Record<keyof CheckoutAddress, string>>;
}

interface PickupVariantProps {
  variant: "pickup";
  value: PickupContact;
  onChange: (value: PickupContact) => void;
  errors?: Partial<Record<keyof PickupContact, string>>;
}

export type AddressFormProps = DeliveryVariantProps | PickupVariantProps;

export function AddressForm(props: AddressFormProps) {
  const { t } = useLanguage();

  if (props.variant === "pickup") {
    const { value, onChange, errors } = props;
    return (
      <CheckoutStepCard step={3} title={t("pickupContact")}>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label={t("firstName")}
            autoComplete="given-name"
            required
            value={value.firstName}
            error={errors?.firstName}
            onChange={(e) => onChange({ ...value, firstName: e.target.value })}
          />
          <Input
            label={t("lastName")}
            autoComplete="family-name"
            required
            value={value.lastName}
            error={errors?.lastName}
            onChange={(e) => onChange({ ...value, lastName: e.target.value })}
          />
        </div>
        <Input
          className="mt-3"
          type="tel"
          label={t("phone")}
          placeholder="(555) 000-0000"
          autoComplete="tel"
          required
          value={value.phone}
          error={errors?.phone}
          onChange={(e) => onChange({ ...value, phone: e.target.value })}
        />
      </CheckoutStepCard>
    );
  }

  const { value, onChange, errors } = props;
  return (
    <CheckoutStepCard step={3} title={t("deliveryAddress")}>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label={t("firstName")}
          autoComplete="given-name"
          required
          value={value.firstName}
          error={errors?.firstName}
          onChange={(e) => onChange({ ...value, firstName: e.target.value })}
        />
        <Input
          label={t("lastName")}
          autoComplete="family-name"
          required
          value={value.lastName}
          error={errors?.lastName}
          onChange={(e) => onChange({ ...value, lastName: e.target.value })}
        />
      </div>
      <Input
        className="mt-3"
        label={t("address")}
        placeholder={t("streetAddressPlaceholder")}
        autoComplete="address-line1"
        required
        value={value.line1}
        error={errors?.line1}
        onChange={(e) => onChange({ ...value, line1: e.target.value })}
      />
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Input
          label={t("city")}
          autoComplete="address-level2"
          required
          value={value.city}
          error={errors?.city}
          onChange={(e) => onChange({ ...value, city: e.target.value })}
        />
        <Input
          label={t("postalCode")}
          placeholder={t("zipPlaceholder")}
          autoComplete="postal-code"
          required
          value={value.postalCode}
          error={errors?.postalCode}
          onChange={(e) => onChange({ ...value, postalCode: e.target.value })}
        />
      </div>
      <Input
        className="mt-3"
        type="tel"
        label={t("phone")}
        placeholder="(555) 000-0000"
        autoComplete="tel"
        required
        value={value.phone}
        error={errors?.phone}
        onChange={(e) => onChange({ ...value, phone: e.target.value })}
      />
    </CheckoutStepCard>
  );
}
