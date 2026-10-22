"use client";

import { useState, type FormEvent } from "react";
import {
  AlertCircle,
  Eye,
  EyeOff,
  LoaderCircle,
  ShieldCheck,
  UserRoundPlus,
  X,
} from "lucide-react";

import type {
  AdminUser,
  UserFormValues,
  UserRole,
  UserStatus,
} from "@/types/admin-users/user";
import { userRoles } from "@/data/admin-users/dummy-data";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: AdminUser | null;
  onSave: (values: UserFormValues) => Promise<string | null>;
}

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "Registration Staff" as UserRole,
  status: "Active" as UserStatus,
};

const fieldClassName =
  "h-10 rounded-lg border-slate-200 bg-white px-3 text-sm shadow-none transition-colors placeholder:text-slate-400 focus-visible:border-teal-600 focus-visible:ring-1 focus-visible:ring-teal-600 focus-visible:ring-offset-0";

const selectClassName =
  "flex h-10 w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus-visible:border-teal-600 focus-visible:ring-1 focus-visible:ring-teal-600 focus-visible:ring-offset-0";

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  onSave,
}: UserFormDialogProps) {
  const [form, setForm] = useState(() =>
    user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: "",
          role: user.role,
          status: user.status,
        }
      : { ...emptyForm },
  );

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim().toLowerCase();

    if (!firstName || !lastName || !email) {
      setError("Please complete all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!user && !form.password) {
      setError("Please enter a password for the new staff account.");
      return;
    }

    setIsSaving(true);

    try {
      const saveError = await onSave({
        firstName,
        lastName,
        email,
        role: form.role,
        status: form.status,
        ...(!user ? { password: form.password } : {}),
      });

      if (saveError) {
        setError(saveError);
        return;
      }

      onOpenChange(false);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save the staff account.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function updateField<K extends keyof typeof emptyForm>(
    field: K,
    value: (typeof emptyForm)[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isSaving) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent className="flex max-h-[90dvh] flex-col gap-0 overflow-hidden border-slate-200 bg-white p-0 shadow-xl sm:max-w-xl">
        {/* Header */}
        <DialogHeader className="shrink-0 border-b border-slate-100 bg-slate-50/70 px-6 py-5 text-left sm:px-7">
          <div className="flex items-start gap-4 pr-7">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-teal-50 text-teal-700">
              {user ? <ShieldCheck size={21} /> : <UserRoundPlus size={21} />}
            </div>

            <div className="min-w-0 space-y-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-teal-700">
                  Administrator access
                </span>
              </div>

              <DialogTitle className="text-lg font-semibold tracking-tight text-slate-900">
                {user ? "Edit User" : "Create Staff Account"}
              </DialogTitle>

              <DialogDescription className="max-w-sm text-sm leading-5 text-slate-500">
                {user
                  ? "Update the staff member's profile, assigned role, and account status."
                  : "Provision an account for a staff member and assign the appropriate system permissions."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          {/* Scrollable Form Content */}
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-6 py-6 sm:px-7">
            {/* Personal Information */}
            <section className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Personal Information
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Enter the employee&apos;s identifying and contact information.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-sm font-medium text-slate-700"
                  >
                    First Name <span className="text-rose-600">*</span>
                  </Label>

                  <Input
                    id="firstName"
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={(event) =>
                      updateField("firstName", event.target.value)
                    }
                    placeholder="e.g. Maria"
                    className={fieldClassName}
                    disabled={isSaving}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-sm font-medium text-slate-700"
                  >
                    Last Name <span className="text-rose-600">*</span>
                  </Label>

                  <Input
                    id="lastName"
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={(event) =>
                      updateField("lastName", event.target.value)
                    }
                    placeholder="e.g. Santos"
                    className={fieldClassName}
                    disabled={isSaving}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700"
                >
                  Work Email <span className="text-rose-600">*</span>
                </Label>

                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="name@carebridge.demo"
                  className={fieldClassName}
                  disabled={isSaving}
                  required
                />

                <p className="text-xs leading-5 text-slate-500">
                  Each staff account must have a unique email address.
                </p>
              </div>

              {!user && (
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-700"
                  >
                    Initial Password <span className="text-rose-600">*</span>
                  </Label>

                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={form.password}
                      onChange={(event) =>
                        updateField("password", event.target.value)
                      }
                      placeholder="Enter an initial password"
                      className={`${fieldClassName} pr-12`}
                      disabled={isSaving}
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      aria-pressed={showPassword}
                      disabled={isSaving}
                      className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>

                  <p className="text-xs leading-5 text-slate-500">
                    Use the eye icon to show or hide the initial password.
                  </p>
                </div>
              )}
            </section>

            {/* Access Settings */}
            <section className="space-y-4 border-t border-slate-100 pt-5">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Access Settings
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Assign the role and account status appropriate to the
                  employee&apos;s responsibilities.
                </p>
              </div>

              <div
                className={`grid gap-4 ${
                  user ? "sm:grid-cols-2" : "sm:grid-cols-1"
                }`}
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="role"
                    className="text-sm font-medium text-slate-700"
                  >
                    System Role <span className="text-rose-600">*</span>
                  </Label>

                  <select
                    id="role"
                    value={form.role}
                    onChange={(event) =>
                      updateField("role", event.target.value as UserRole)
                    }
                    className={selectClassName}
                    disabled={isSaving}
                  >
                    {userRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                {user ? (
                  <div className="space-y-2">
                    <Label
                      htmlFor="status"
                      className="text-sm font-medium text-slate-700"
                    >
                      Account Status
                    </Label>

                    <select
                      id="status"
                      value={form.status}
                      onChange={(event) =>
                        updateField("status", event.target.value as UserStatus)
                      }
                      className={selectClassName}
                      disabled={isSaving}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                ) : (
                  <p className="text-xs leading-5 text-slate-500">
                    New accounts are created as active. You can change the
                    account status after creation.
                  </p>
                )}
              </div>
            </section>

            {/* Administrator Provisioning Notice */}
            <div className="flex items-start gap-3 rounded-xl border border-teal-100 bg-teal-50/60 p-3.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-teal-700">
                <ShieldCheck size={17} />
              </div>

              <div>
                <p className="text-xs font-semibold text-teal-900">
                  Administrator-managed accounts
                </p>

                <p className="mt-1 text-xs leading-5 text-teal-800/80">
                  Account changes are submitted to the CareBridge backend.
                  Public self-registration remains disabled.
                </p>
              </div>
            </div>

            {/* Validation Error */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </div>

          {/* Fixed Footer */}
          <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:justify-end sm:px-7">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
              className="h-10 cursor-pointer border-slate-200 bg-white px-4 text-slate-700 shadow-none hover:bg-slate-100"
            >
              <X className="mr-2 size-4" />
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSaving}
              className="h-10 cursor-pointer bg-teal-700 px-4 font-medium text-white shadow-none hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : user ? (
                "Save Changes"
              ) : (
                "Create Staff Account"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
