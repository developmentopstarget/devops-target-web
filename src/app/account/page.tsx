"use client";

import { useAuth } from "@/lib/auth/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  const toast = useToast();
  const { theme, setTheme } = useTheme();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [currentDir, setCurrentDir] = useState("ltr");

  // Sync state with HTML direction on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentDir(document.documentElement.dir || "ltr");
    }
  }, []);

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
          toast.show("Please correct the errors in the form.", "error");
        } else {
          toast.show(data.error || "Failed to update profile.", "error");
        }
      } else {
        toast.show("Profile updated successfully!", "success");
        await refresh();
      }
    } catch {
      toast.show("Network error. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleDirection = () => {
    if (typeof window !== "undefined") {
      const nextDir = currentDir === "rtl" ? "ltr" : "rtl";
      document.documentElement.dir = nextDir;
      document.documentElement.lang = nextDir === "rtl" ? "fa" : "en";
      setCurrentDir(nextDir);
      toast.show(
        nextDir === "rtl"
          ? "پوسته راست‌چین فعال شد (Farsi/RTL)"
          : "Switched to LTR layout (English)",
        "info"
      );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Breadcrumbs for navigation */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
          { label: "Profile", href: "/account" },
        ]}
      />

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-primary">
          Profile Settings
        </h1>
        <p className="text-[13px] text-secondary">
          Manage your personal details and app preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Main Settings Form */}
        <div className="lg:col-span-2">
          <Card header={<h2 className="text-base font-bold text-primary">Personal Details</h2>}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  error={fieldErrors.first_name}
                  placeholder="Enter your first name"
                />
                <Input
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  error={fieldErrors.last_name}
                  placeholder="Enter your last name"
                />
              </div>

              <Input
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={fieldErrors.username}
                required
                placeholder="Enter username"
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={fieldErrors.email}
                required
                placeholder="Enter email address"
              />

              <div className="pt-2 flex justify-end">
                <Button type="submit" loading={isSubmitting}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Sidebar settings (Theme and RTL mirroring toggle) */}
        <div className="space-y-6">
          <Card header={<h2 className="text-base font-bold text-primary">App Preferences</h2>}>
            <div className="space-y-5">
              
              {/* Theme Selector */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-secondary uppercase tracking-wider">
                  Theme Appearance
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex h-10 items-center justify-center rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                      theme === "light"
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-border bg-surface hover:bg-surface-2 text-secondary hover:text-primary"
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex h-10 items-center justify-center rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                      theme === "dark"
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-border bg-surface hover:bg-surface-2 text-secondary hover:text-primary"
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>

              {/* Language Direction Toggle */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-secondary uppercase tracking-wider">
                  Layout Language
                </label>
                <button
                  onClick={handleToggleDirection}
                  className="flex w-full items-center justify-between rounded-lg border border-border-strong bg-surface px-4 py-3 hover:bg-surface-2 transition-all cursor-pointer"
                >
                  <div className="text-start">
                    <p className="text-[13px] font-bold text-primary">
                      {currentDir === "rtl" ? "Farsi / Persian (RTL)" : "English (LTR)"}
                    </p>
                    <p className="text-[11px] text-secondary">
                      Toggle layout direction to test mirroring
                    </p>
                  </div>
                  <span className="rounded bg-accent/10 px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-accent">
                    {currentDir === "rtl" ? "RTL" : "LTR"}
                  </span>
                </button>
              </div>

            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
