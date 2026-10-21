"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, UserRoundPlus, ShieldCheck, X } from "lucide-react";

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
          <div className="flex items-start justify-between gap-4 pr-7">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-teal-50 text-teal-700">
                {user ? (
                  <ShieldCheck className="h-5 w-5" />
                ) : (
                  <UserRoundPlus className="h-5 w-5" />
                )}
              </div>

              <div className="space-y-1">
                <DialogTitle className="text-lg font-semibold tracking-tight text-slate-900">
                  {user ? "Edit User" : "Add New User"}
                </DialogTitle>

                <DialogDescription className="max-w-sm text-sm leading-5 text-slate-500">
                  {user
                    ? "Update the staff member's information and system access."
                    : "Create a staff account and assign the appropriate system role."}
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-6 sm:px-7">
            {/* Personal Information */}
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-800">
                Personal Information
              </h3>

              <p className="text-xs text-slate-500">
                Enter the staff member&apos;s basic details.
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
                Email Address <span className="text-rose-600">*</span>
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
                Use a unique email address for each staff account.
              </p>
            </div>

            {/* Access Settings */}
            <div className="border-t border-slate-100 pt-5">
              <div className="mb-4 space-y-1">
                <h3 className="text-sm font-semibold text-slate-800">
                  Access Settings
                </h3>

                <p className="text-xs text-slate-500">
                  Define the staff member&apos;s role and account status.
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
            </div>

            {/* Demo Notice */}
            <div className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

              <p className="text-xs leading-5 text-slate-600">
                This is a demo form. Changes are held in frontend state and do
                not create or modify actual user accounts.
              </p>
            </div>

            {/* Validation Error */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
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
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>

            <Button
              type="submit"
              className="h-10 cursor-pointer bg-teal-700 px-4 font-medium text-white shadow-none hover:bg-teal-800"
            >
              {user ? "Save Changes" : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
