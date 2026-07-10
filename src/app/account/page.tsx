"use client";

import { useAuth } from "@/lib/auth/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useLanguage } from "@/lib/useLanguage";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  const toast = useToast();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Hydrate form from user object
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        first_name: (user.first_name as string) || "",
        last_name: (user.last_name as string) || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle validation errors from backend
        if (data && typeof data === "object") {
          const errors: Record<string, string> = {};
          Object.entries(data).forEach(([key, val]) => {
            if (Array.isArray(val)) {
              errors[key] = val.join(" ");
            } else if (typeof val === "string") {
              errors[key] = val;
            }
          });
          setFieldErrors(errors);
          toast.show(t("correctErrors"), "error");
        } else {
          toast.show(data.error || t("correctErrors"), "error");
        }
      } else {
        toast.show(t("updateSuccess"), "success");
        await refresh();
      }
    } catch {
      toast.show(t("networkError"), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumbs for navigation */}
      <Breadcrumbs
        items={[
          { label: t("home"), href: "/" },
          { label: t("account"), href: "/account" },
          { label: t("profile"), href: "/account" },
        ]}
      />

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-primary">
          {t("profileSettings")}
        </h1>
        <p className="text-[13px] text-secondary">
          {t("managePersonalDetails")}
        </p>
      </div>

      <div className="space-y-4">
        <Card header={<h2 className="text-base font-bold text-primary">{t("personalDetails")}</h2>}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t("firstName")}
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              error={fieldErrors.first_name}
              placeholder={t("firstNamePlaceholder")}
            />
            <Input
              label={t("lastName")}
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              error={fieldErrors.last_name}
              placeholder={t("lastNamePlaceholder")}
            />
            <Input
              label={t("username")}
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={fieldErrors.username}
              required
              placeholder={t("usernamePlaceholder")}
            />
            <Input
              label={t("emailAddress")}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={fieldErrors.email}
              required
              placeholder={t("emailPlaceholder")}
            />
            <div className="pt-2 flex justify-end">
              <Button type="submit" loading={isSubmitting}>
                {t("saveChanges")}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
