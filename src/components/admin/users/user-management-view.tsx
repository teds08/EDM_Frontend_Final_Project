"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Plus, RefreshCw, ShieldCheck, Users } from "lucide-react";

import type {
  AdminUser,
  CreateUserPayload,
  UpdateUserPayload,
  UserFormValues,
  UserListResponse,
  UserRole,
  UserStatus,
} from "@/types/admin-users/user";

import {
  mapBackendUser,
  toApiUserRole,
  toApiUserStatus,
} from "@/lib/admin-users";
import { apiRequest, ApiError, AUTH_TOKEN_KEY } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { UserStats } from "@/components/admin/users/user-stats";
import { UserTable } from "@/components/admin/users/user-table";
import { UserFormDialog } from "@/components/admin/users/user-form-dialog";

const PAGE_SIZE = 10;

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

export function UserManagementView() {
  const router = useRouter();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "All roles">(
    "All roles",
  );
  const [statusFilter, setStatusFilter] = useState<UserStatus | "All statuses">(
    "All statuses",
  );

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadUsers = async () => {
      setIsLoading(true);
      setPageError("");

      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
      });

      const trimmedSearch = search.trim();

      if (trimmedSearch) {
        params.set("search", trimmedSearch);
      }

      if (roleFilter !== "All roles") {
        params.set("role", toApiUserRole(roleFilter));
      }

      if (statusFilter !== "All statuses") {
        params.set("status", toApiUserStatus(statusFilter));
      }

      try {
        const response = await apiRequest<UserListResponse>(
          `/api/users?${params.toString()}`,
          {
            method: "GET",
            signal: controller.signal,
          },
        );

        if (controller.signal.aborted) {
          return;
        }

        const records = Array.isArray(response.data) ? response.data : [];
        const mappedUsers = records.map(mapBackendUser);

        const matchingTotal =
          response.pagination?.totalItems ??
          response.pagination?.total ??
          response.total ??
          mappedUsers.length;

        const calculatedPages = Math.max(
          1,
          Math.ceil(matchingTotal / PAGE_SIZE),
        );

        setUsers(mappedUsers);
        setTotalCount(matchingTotal);
        setTotalPages(response.pagination?.totalPages ?? calculatedPages);

        setStats({
          total: response.total ?? matchingTotal,
          active:
            response.active ??
            mappedUsers.filter((user) => user.status === "Active").length,
          inactive:
            response.inactive ??
            mappedUsers.filter((user) => user.status === "Inactive").length,
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        if (error instanceof ApiError && error.status === 401) {
          window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
          router.replace("/login");
        }

        setPageError(getErrorMessage(error));
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    // Keep search from sending a request on every individual keystroke.
    const timeoutId = window.setTimeout(() => {
      void loadUsers();
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [page, search, roleFilter, statusFilter, reloadKey, router]);

  function openCreateDialog() {
    setSelectedUser(null);
    setFormOpen(true);
  }

  function openEditDialog(user: AdminUser) {
    setSelectedUser(user);
    setFormOpen(true);
  }

  async function saveUser(values: UserFormValues): Promise<string | null> {
    let serverChanged = false;

    try {
      setPageError("");

      if (selectedUser) {
        const userId = encodeURIComponent(selectedUser.id);

        const payload: UpdateUserPayload = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          role: toApiUserRole(values.role),
        };

        await apiRequest<{
          success?: boolean;
          message?: string;
        }>(`/api/users/${userId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });

        serverChanged = true;

        if (values.status !== selectedUser.status) {
          await apiRequest<{
            success?: boolean;
            message?: string;
          }>(`/api/users/${userId}/status`, {
            method: "PATCH",
            body: JSON.stringify({
              status: toApiUserStatus(values.status),
            }),
          });
        }
      } else {
        if (!values.password) {
          return "A password is required to create a staff account.";
        }

        const payload: CreateUserPayload = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          role: toApiUserRole(values.role),
        };

        await apiRequest<{
          success?: boolean;
          message?: string;
        }>("/api/users", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        serverChanged = true;

        // Show the newly created account by clearing the current filters.
        setSearch("");
        setRoleFilter("All roles");
        setStatusFilter("All statuses");
        setPage(1);
      }

      setReloadKey((current) => current + 1);

      return null;
    } catch (error) {
      // An edit may have succeeded even if a separate status update failed.
      // Refresh the list so it reflects any changes already saved.
      if (serverChanged) {
        setReloadKey((current) => current + 1);
      }

      return getErrorMessage(error);
    }
  }

  async function toggleUserStatus(user: AdminUser): Promise<string | null> {
    try {
      setPageError("");

      const status = user.status === "Active" ? "INACTIVE" : "ACTIVE";
      const userId = encodeURIComponent(user.id);

      await apiRequest<{
        success?: boolean;
        message?: string;
      }>(`/api/users/${userId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      setReloadKey((current) => current + 1);

      return null;
    } catch (error) {
      return getErrorMessage(error);
    }
  }

  function resetFilters() {
    setSearch("");
    setRoleFilter("All roles");
    setStatusFilter("All statuses");
    setPage(1);
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

      {/* Backend Integration Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-teal-200 bg-teal-50 p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />

        <div className="space-y-1">
          <p className="text-sm font-semibold text-teal-900">
            Connected to CareBridge API
          </p>

          <p className="text-sm leading-5 text-teal-800">
            User records are loaded from the backend. Successful account changes
            are saved through the API and reflected in the directory.
          </p>
        </div>
      </div>

      {/* API Error */}
      {pageError && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-700" />

            <div>
              <p className="text-sm font-semibold text-rose-900">
                Unable to load user information
              </p>

              <p className="mt-1 text-sm leading-5 text-rose-800">
                {pageError}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => setReloadKey((current) => current + 1)}
            className="cursor-pointer border-rose-200 bg-white text-rose-800 hover:bg-rose-100"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      )}

      {/* User Statistics */}
      <UserStats
        total={stats.total}
        active={stats.active}
        inactive={stats.inactive}
      />

      {/* User Directory */}
      <UserTable
        users={users}
        search={search}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        isLoading={isLoading}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onRoleFilterChange={(value) => {
          setRoleFilter(value);
          setPage(1);
        }}
        onStatusFilterChange={(value) => {
          setStatusFilter(value);
          setPage(1);
        }}
        onPageChange={(nextPage) => {
          setPage(Math.min(totalPages, Math.max(1, nextPage)));
        }}
        onResetFilters={resetFilters}
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
