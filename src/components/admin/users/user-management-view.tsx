"use client";

import { useMemo, useState } from "react";
import { Plus, ShieldCheck, Users } from "lucide-react";

import { initialAdminUsers } from "@/data/admin-users/dummy-data";
import type { AdminUser } from "@/types/admin-users/user";

import { Button } from "@/components/ui/button";
import { UserStats } from "@/components/admin/users/user-stats";
import { UserTable } from "@/components/admin/users/user-table";
import { UserFormDialog } from "@/components/admin/users/user-form-dialog";

export function UserManagementView() {
  const [users, setUsers] = useState<AdminUser[]>(initialAdminUsers);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((user) => user.status === "Active").length,
      inactive: users.filter((user) => user.status === "Inactive").length,
    }),
    [users],
  );

  function openCreateDialog() {
    setSelectedUser(null);
    setFormOpen(true);
  }

  function openEditDialog(user: AdminUser) {
    setSelectedUser(user);
    setFormOpen(true);
  }

  function saveUser(user: AdminUser): string | null {
    const duplicateEmail = users.some(
      (existing) =>
        existing.email.toLowerCase() === user.email.toLowerCase() &&
        existing.id !== user.id,
    );

    if (duplicateEmail) {
      return "An account with this email address already exists.";
    }

    setUsers((currentUsers) => {
      const existingUser = currentUsers.some(
        (existing) => existing.id === user.id,
      );

      if (existingUser) {
        return currentUsers.map((existing) =>
          existing.id === user.id ? user : existing,
        );
      }

      return [user, ...currentUsers];
    });

    return null;
  }

  function toggleUserStatus(user: AdminUser) {
    setUsers((currentUsers) =>
      currentUsers.map((existing) =>
        existing.id === user.id
          ? {
              ...existing,
              status: existing.status === "Active" ? "Inactive" : "Active",
            }
          : existing,
      ),
    );
  }

  return (
    <div className="space-y-7 pb-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-teal-700">
            <Users className="h-4 w-4" />
            Administration
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            User Management
          </h1>

          <p className="max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Manage staff accounts, assign system roles, and control access to
            the CareBridge healthcare data integration system.
          </p>
        </div>

        <Button
          onClick={openCreateDialog}
          className="cursor-pointer bg-teal-700 text-white hover:bg-teal-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Demo Environment Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />

        <div className="space-y-1">
          <p className="text-sm font-semibold text-blue-900">
            Demo environment
          </p>

          <p className="text-sm leading-5 text-blue-800">
            User changes are held in page state only. No real accounts,
            permissions, or database records are changed.
          </p>
        </div>
      </div>

      {/* User Statistics */}
      <UserStats
        total={stats.total}
        active={stats.active}
        inactive={stats.inactive}
      />

      {/* User Directory */}
      <UserTable
        users={users}
        onEdit={openEditDialog}
        onToggleStatus={toggleUserStatus}
      />

      {/* Add/Edit User Dialog */}
      {formOpen && (
        <UserFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          user={selectedUser}
          onSave={saveUser}
        />
      )}
    </div>
  );
}
