"use client";

import { useToast } from "@/components/ui/Toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { MapPinIcon, TrashIcon } from "@/components/ui/icons";
import { useState, useEffect } from "react";

interface Address {
  id: number;
  first_name: string;
  last_name: string;
  line1: string;
  city: string;
  postal_code: string;
  phone: string;
  is_default: boolean;
}

export default function AddressesPage() {
  const toast = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    line1: "",
    city: "",
    postal_code: "",
    phone: "",
    is_default: false,
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/addresses");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setAddresses(data);
    } catch {
      toast.show("Could not load addresses.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      line1: "",
      city: "",
      postal_code: "",
      phone: "",
      is_default: false,
    });
    setEditingAddress(null);
    setFieldErrors({});
    setIsFormOpen(false);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (addr: Address) => {
    setEditingAddress(addr);
    setFormData({
      first_name: addr.first_name,
      last_name: addr.last_name,
      line1: addr.line1,
      city: addr.city,
      postal_code: addr.postal_code,
      phone: addr.phone,
      is_default: addr.is_default,
    });
    setFieldErrors({});
    setIsFormOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});

    const url = editingAddress
      ? `/api/addresses/${editingAddress.id}`
      : "/api/addresses";
    const method = editingAddress ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data && typeof data === "object") {
          const errors: Record<string, string> = {};
          Object.entries(data).forEach(([key, val]) => {
            errors[key] = Array.isArray(val) ? val.join(" ") : String(val);
          });
          setFieldErrors(errors);
        } else {
          toast.show("Failed to save address.", "error");
        }
      } else {
        toast.show(
          editingAddress
            ? "Address updated successfully."
            : "Address added successfully.",
          "success"
        );
        resetForm();
        fetchAddresses();
      }
    } catch {
      toast.show("Network error. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast.show("Address deleted successfully.", "success");
      fetchAddresses();
    } catch {
      toast.show("Failed to delete address.", "error");
    }
  };

  const handleSetDefault = async (addr: Address) => {
    try {
      const res = await fetch(`/api/addresses/${addr.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_default: true }),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast.show("Default address updated.", "success");
      fetchAddresses();
    } catch {
      toast.show("Failed to update default address.", "error");
    }
  };

  return (
    <div className="max-w-full overflow-x-hidden box-border space-y-6 px-4">
      
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
          { label: "Addresses", href: "/account/addresses" },
        ]}
      />

      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-primary">
            Saved Addresses
          </h1>
          <p className="text-[13px] text-secondary">
            Manage your delivery addresses for a faster checkout.
          </p>
        </div>
        {!isFormOpen && (
          <Button onClick={handleOpenAdd} size="sm">
            Add Address
          </Button>
        )}
      </div>

      {/* Address Form (Inline Card) */}
      {isFormOpen && (
        <Card
          header={
            <h2 className="text-base font-bold text-primary">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </h2>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                error={fieldErrors.first_name}
                required
                placeholder="Recipient first name"
              />
              <Input
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                error={fieldErrors.last_name}
                required
                placeholder="Recipient last name"
              />
            </div>

            <Input
              label="Street Address"
              name="line1"
              value={formData.line1}
              onChange={handleInputChange}
              error={fieldErrors.line1}
              required
              placeholder="e.g. 123 Main St, Apt 4B"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                error={fieldErrors.city}
                required
                placeholder="e.g. Springfield"
              />
              <Input
                label="Postal / ZIP Code"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleInputChange}
                error={fieldErrors.postal_code}
                required
                placeholder="e.g. 12345"
              />
            </div>

            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              error={fieldErrors.phone}
              required
              placeholder="e.g. (555) 000-0000"
            />

            <label className="flex items-center gap-3 py-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_default"
                checked={formData.is_default}
                onChange={handleInputChange}
                className="h-4.5 w-4.5 rounded border-border-strong text-accent focus:ring-accent cursor-pointer"
              />
              <span className="text-[13.5px] font-semibold text-primary">
                Set as default delivery address
              </span>
            </label>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button type="button" variant="secondary" onClick={resetForm} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting}>
                {editingAddress ? "Update Address" : "Save Address"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Addresses List */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i} className="p-4 space-y-4">
              <div className="h-5 w-1/3 bg-surface-2 rounded animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-surface-2 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-surface-2 rounded animate-pulse" />
              </div>
            </Card>
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <EmptyState
          icon={<MapPinIcon className="h-6 w-6" />}
          title="No saved addresses"
          description="Add a delivery address to enable express checkout."
          action={
            <Button onClick={handleOpenAdd}>
              Add Address
            </Button>
          }
          className="py-12"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <Card
              key={addr.id}
              className={`relative overflow-hidden border ${
                addr.is_default ? "border-accent ring-1 ring-accent/30" : "border-border"
              }`}
            >
              <div className="flex flex-col h-full justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[14.5px] font-bold text-primary">
                      {addr.first_name} {addr.last_name}
                    </h3>
                    {addr.is_default && (
                      <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-accent">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-secondary leading-relaxed">
                    {addr.line1}
                    <br />
                    {addr.city}, {addr.postal_code}
                  </p>
                  <p className="text-[11.5px] font-mono text-tertiary">
                    Phone: {addr.phone}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border mt-auto">
                  {!addr.is_default && (
                    <button
                      onClick={() => handleSetDefault(addr)}
                      className="text-[12px] font-bold text-accent hover:text-accent-hover cursor-pointer"
                    >
                      Make Default
                    </button>
                  )}
                  <button
                    onClick={() => handleOpenEdit(addr)}
                    className="text-[12px] font-bold text-secondary hover:text-primary cursor-pointer ms-auto"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="text-[12px] font-bold text-danger hover:opacity-80 cursor-pointer flex items-center gap-1"
                    aria-label="Delete address"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
}
