"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownUp,
  MoreHorizontal,
  Pencil,
  Search,
  ShieldCheck,
  UserRound,
  UserRoundX,
} from "lucide-react";

import type { AdminUser } from "@/types/admin-users/user";
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
  onEdit: (user: AdminUser) => void;
  onToggleStatus: (user: AdminUser) => void;
}

export function UserTable({ users, onEdit, onToggleStatus }: UserTableProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All roles");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [pendingUser, setPendingUser] = useState<AdminUser | null>(null);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();

      const matchesSearch =
        fullName.includes(term) || user.email.toLowerCase().includes(term);

      const matchesRole =
        roleFilter === "All roles" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All statuses" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  function confirmStatusChange() {
    if (!pendingUser) return;

    onToggleStatus(pendingUser);
    setPendingUser(null);
  }

  function resetFilters() {
    setSearch("");
    setRoleFilter("All roles");
    setStatusFilter("All statuses");
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

          {/* Search and Filters */}
          <div className="grid gap-3 md:grid-cols-[minmax(200px,1fr)_190px_170px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name or email..."
                className="pl-9"
                aria-label="Search users by name or email"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              aria-label="Filter by role"
              className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
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
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by account status"
              className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
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
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    {/* User Information */}
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

                    {/* User Role */}
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <ShieldCheck className="h-4 w-4 shrink-0 text-slate-400" />
                        {user.role}
                      </div>
                    </TableCell>

                    {/* Account Status */}
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

                    {/* Last Activity */}
                    <TableCell className="text-sm text-slate-500">
                      {user.lastActivity}
                    </TableCell>

                    {/* Actions */}
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
                            onClick={() => setPendingUser(user)}
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

                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-sm text-slate-500"
                    >
                      No users match your search or filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Table Footer */}
          <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing{" "}
              <span className="font-medium text-slate-900">
                {filteredUsers.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-900">{users.length}</span>{" "}
              users
            </p>

            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer self-start"
              onClick={resetFilters}
            >
              <ArrowDownUp className="mr-2 h-4 w-4" />
              Reset filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activate/Deactivate Confirmation */}
      <AlertDialog
        open={pendingUser !== null}
        onOpenChange={(open) => {
          if (!open) setPendingUser(null);
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
                  } ${pendingUser.firstName} ${pendingUser.lastName}'s demo account. This change only affects the current page state.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={confirmStatusChange}
              className="bg-teal-700 text-white hover:bg-teal-800"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
