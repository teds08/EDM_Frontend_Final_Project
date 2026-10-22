"use client";

import { useState } from "react";
import {
  ArrowDownUp,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Search,
  ShieldCheck,
  UserRound,
  UserRoundX,
} from "lucide-react";

import type { AdminUser, UserRole, UserStatus } from "@/types/admin-users/user";
import { userRoles } from "@/data/admin-users/dummy-data";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserTableProps {
  users: AdminUser[];
  search: string;
  roleFilter: UserRole | "All roles";
  statusFilter: UserStatus | "All statuses";
  page: number;
  totalPages: number;
  totalCount: number;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (value: UserRole | "All roles") => void;
  onStatusFilterChange: (value: UserStatus | "All statuses") => void;
  onPageChange: (page: number) => void;
  onResetFilters: () => void;
  onEdit: (user: AdminUser) => void;
  onToggleStatus: (user: AdminUser) => Promise<string | null>;
}

export function UserTable({
  users,
  search,
  roleFilter,
  statusFilter,
  page,
  totalPages,
  totalCount,
  isLoading,
  onSearchChange,
  onRoleFilterChange,
  onStatusFilterChange,
  onPageChange,
  onResetFilters,
  onEdit,
  onToggleStatus,
}: UserTableProps) {
  const [pendingUser, setPendingUser] = useState<AdminUser | null>(null);
  const [statusError, setStatusError] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  async function confirmStatusChange() {
    if (!pendingUser || isUpdatingStatus) {
      return;
    }

    setIsUpdatingStatus(true);
    setStatusError("");

    try {
      const error = await onToggleStatus(pendingUser);

      if (error) {
        setStatusError(error);
        return;
      }

      setPendingUser(null);
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  function resetFilters() {
    onResetFilters();
  }

  return (
    <>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-lg font-semibold text-slate-900">
              User Directory
            </CardTitle>

            <p className="text-sm text-slate-500">
              View and manage accounts with access to CareBridge.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-[minmax(200px,1fr)_190px_170px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search name or email..."
                className="pl-9"
                aria-label="Search users by name or email"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(event) =>
                onRoleFilterChange(event.target.value as UserRole | "All roles")
              }
              aria-label="Filter by role"
              className="h-10 cursor-pointer rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            >
              <option value="All roles">All roles</option>

              {userRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) =>
                onStatusFilterChange(
                  event.target.value as UserStatus | "All statuses",
                )
              }
              aria-label="Filter by account status"
              className="h-10 cursor-pointer rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            >
              <option value="All statuses">All statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="min-w-[240px]">User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="min-w-[140px]">Last Activity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading && users.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-sm text-slate-500"
                    >
                      Loading users...
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && users.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-sm text-slate-500"
                    >
                      No users match your search or filters.
                    </TableCell>
                  </TableRow>
                )}

                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-sm font-semibold text-teal-800">
                          {user.firstName.charAt(0)}
                          {user.lastName.charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <p className="font-medium text-slate-900">
                            {user.firstName} {user.lastName}
                          </p>

                          <p className="truncate text-sm text-slate-500">
                            {user.email}
                          </p>

                          <p className="text-xs text-slate-400">
                            ID: {user.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <ShieldCheck className="h-4 w-4 shrink-0 text-slate-400" />
                        {user.role}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.status === "Active"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-slate-100 text-slate-600"
                        }
                      >
                        <span
                          className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                            user.status === "Active"
                              ? "bg-emerald-500"
                              : "bg-slate-400"
                          }`}
                        />

                        {user.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-sm text-slate-500">
                      {user.lastActivity}
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          aria-label={`Actions for ${user.firstName} ${user.lastName}`}
                          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => onEdit(user)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit user
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                              setStatusError("");
                              setPendingUser(user);
                            }}
                          >
                            {user.status === "Active" ? (
                              <>
                                <UserRoundX className="mr-2 h-4 w-4" />
                                Deactivate account
                              </>
                            ) : (
                              <>
                                <UserRound className="mr-2 h-4 w-4" />
                                Activate account
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p>
                Showing{" "}
                <span className="font-medium text-slate-900">
                  {users.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-900">{totalCount}</span>{" "}
                users
              </p>

              {isLoading && users.length > 0 && (
                <p className="mt-1 text-xs text-teal-700">
                  Refreshing user directory...
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="cursor-pointer"
              >
                <ArrowDownUp className="mr-2 h-4 w-4" />
                Reset filters
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1 || isLoading}
                className="cursor-pointer"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="whitespace-nowrap text-xs tabular-nums">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages || isLoading}
                className="cursor-pointer"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={pendingUser !== null}
        onOpenChange={(open) => {
          if (!open && !isUpdatingStatus) {
            setPendingUser(null);
            setStatusError("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingUser?.status === "Active"
                ? "Deactivate this account?"
                : "Activate this account?"}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {pendingUser
                ? `You are about to ${
                    pendingUser.status === "Active" ? "deactivate" : "activate"
                  } ${pendingUser.firstName} ${pendingUser.lastName}'s account. This change will be submitted to the backend.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {statusError && (
            <div
              role="alert"
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
            >
              {statusError}
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isUpdatingStatus}
              className="cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={isUpdatingStatus}
              onClick={(event) => {
                event.preventDefault();
                void confirmStatusChange();
              }}
              className="cursor-pointer bg-teal-700 text-white hover:bg-teal-800"
            >
              {isUpdatingStatus ? "Saving..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
