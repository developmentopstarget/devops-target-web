import { Input } from "@/components/ui/Input";
import { CheckoutStepCard } from "@/components/commerce/CheckoutStepCard";
import type { CheckoutAddress, PickupContact } from "@/lib/checkout";

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
  if (props.variant === "pickup") {
    const { value, onChange, errors } = props;
    return (
      <CheckoutStepCard step={3} title="Pickup contact">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First name"
            autoComplete="given-name"
            required
            value={value.firstName}
            error={errors?.firstName}
            onChange={(e) => onChange({ ...value, firstName: e.target.value })}
          />
          <Input
            label="Last name"
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
          label="Phone"
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
    <CheckoutStepCard step={3} title="Delivery address">
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="First name"
          autoComplete="given-name"
          required
          value={value.firstName}
          error={errors?.firstName}
          onChange={(e) => onChange({ ...value, firstName: e.target.value })}
        />
        <Input
          label="Last name"
          autoComplete="family-name"
          required
          value={value.lastName}
          error={errors?.lastName}
          onChange={(e) => onChange({ ...value, lastName: e.target.value })}
        />
      </div>
      <Input
        className="mt-3"
        label="Address"
        placeholder="Street address"
        autoComplete="address-line1"
        required
        value={value.line1}
        error={errors?.line1}
        onChange={(e) => onChange({ ...value, line1: e.target.value })}
      />
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Input
          label="City"
          autoComplete="address-level2"
          required
          value={value.city}
          error={errors?.city}
          onChange={(e) => onChange({ ...value, city: e.target.value })}
        />
        <Input
          label="Postal code"
          placeholder="ZIP"
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
        label="Phone"
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
