"use client";

import { useToast } from "@/components/ui/Toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useState } from "react";

export default function SecurityPage() {
  const toast = useToast();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [isToggling2fa, setIsToggling2fa] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.show("New passwords do not match.", "error");
      return;
    }

    setIsChangingPassword(true);
    // Simulate API call
    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.show("Password changed successfully!", "success");
    }, 1000);
  };

  const handleToggle2fa = () => {
    setIsToggling2fa(true);
    setTimeout(() => {
      setIsToggling2fa(false);
      setIs2faEnabled(!is2faEnabled);
      toast.show(
        !is2faEnabled
          ? "2FA setup initiated. (Backend stubbed for Phase 4)"
          : "2FA disabled successfully.",
        "info"
      );
    }, 800);
  };

  return (
    <div className="max-w-full overflow-x-hidden box-border space-y-6 px-4">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
          { label: "Security", href: "/account/security" },
        ]}
      />

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-primary">
          Security Settings
        </h1>
        <p className="text-[13px] text-secondary">
          Update your password and manage two-factor authentication.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Change Password Card */}
        <Card header={<h2 className="text-base font-bold text-primary">Change Password</h2>}>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
              placeholder="Enter current password"
            />
            <Input
              label="New Password"
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
              placeholder="Enter new password"
            />
            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
              placeholder="Confirm new password"
            />
            <div className="pt-2 flex justify-end">
              <Button type="submit" loading={isChangingPassword}>
                Update Password
              </Button>
            </div>
          </form>
        </Card>

        {/* 2FA Status Card */}
        <Card header={<h2 className="text-base font-bold text-primary">Two-Factor Authentication (2FA)</h2>}>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-lg bg-surface-2 p-4">
              <div>
                <p className="text-[13px] font-bold text-primary">
                  Status: {is2faEnabled ? "Enabled" : "Disabled"}
                </p>
                <p className="text-[11px] text-secondary mt-1">
                  Add an extra layer of security to your computer shop account.
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
                  is2faEnabled ? "bg-success/15 text-success" : "bg-secondary/15 text-secondary"
                }`}
              >
                {is2faEnabled ? "Active" : "Inactive"}
              </span>
            </div>

            <p className="text-[12px] text-secondary leading-relaxed">
              When 2FA is active, you will be prompted for a secure authentication token from your phone code generator app during sign-in.
            </p>

            <div className="pt-2">
              <Button
                onClick={handleToggle2fa}
                loading={isToggling2fa}
                variant={is2faEnabled ? "danger" : "primary"}
                fullWidth
              >
                {is2faEnabled ? "Disable 2FA" : "Enable Two-Factor Authentication"}
              </Button>
            </div>

            <div className="rounded-lg border border-yellow-200/50 bg-yellow-50/50 p-3 dark:border-yellow-950/20 dark:bg-yellow-950/10">
              <p className="text-[11px] font-medium text-warning leading-normal">
                Note: 2FA challenge is currently simulated. Full integration with the django-otp backend will launch in Phase 4.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
