"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, ShieldCheck, UserRoundPlus, X } from "lucide-react";

import type { AdminUser, UserRole, UserStatus } from "@/types/admin-users/user";
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
  onSave: (user: AdminUser) => string | null;
}

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
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
          role: user.role,
          status: user.status,
        }
      : { ...emptyForm },
  );

  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

    const saveError = onSave({
      id: user?.id ?? `USR-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      firstName,
      lastName,
      email,
      role: form.role,
      status: form.status,
      lastActivity: user?.lastActivity ?? "Never",
      createdAt: user?.createdAt ?? new Date().toISOString().slice(0, 10),
    });

    if (saveError) {
      setError(saveError);
      return;
    }

    onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden border-slate-200 bg-white p-0 shadow-xl sm:max-w-xl">
        {/* Header */}
        <DialogHeader className="border-b border-slate-100 bg-slate-50/70 px-6 py-5 text-left sm:px-7">
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

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 px-6 py-6 sm:px-7">
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
                  required
                />

                <p className="text-xs leading-5 text-slate-500">
                  Each staff account must have a unique email address.
                </p>
              </div>
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

              <div className="grid gap-4 sm:grid-cols-2">
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
                  >
                    {userRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

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
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
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
                  Staff accounts are provisioned through User Management. Public
                  self-registration is disabled. In this demo, changes are held
                  in frontend state and are not saved to a database or
                  authentication service.
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

          {/* Footer */}
          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:justify-end sm:px-7">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 cursor-pointer border-slate-200 bg-white px-4 text-slate-700 shadow-none hover:bg-slate-100"
            >
              <X className="mr-2 size-4" />
              Cancel
            </Button>

            <Button
              type="submit"
              className="h-10 cursor-pointer bg-teal-700 px-4 font-medium text-white shadow-none hover:bg-teal-800"
            >
              {user ? "Save Changes" : "Create Staff Account"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
