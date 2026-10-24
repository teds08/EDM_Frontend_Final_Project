"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu, ShieldCheck, X } from "lucide-react";

import { AUTH_ROLE_KEY, AUTH_TOKEN_KEY } from "@/lib/api";
import { useAdminNavigation } from "@/components/admin/admin-navigation-context";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export function AdminHeader() {
  const router = useRouter();

  const { mobileMenuOpen, setMobileMenuOpen } = useAdminNavigation();

  const [logoutOpen, setLogoutOpen] = useState(false);

  function handleLogout() {
    window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
    window.sessionStorage.removeItem(AUTH_ROLE_KEY);

    setMobileMenuOpen(false);
    setLogoutOpen(false);
    router.replace("/login");
  }

  function openLogoutConfirmation() {
    setMobileMenuOpen(false);
    setLogoutOpen(true);
  }

  return (
    <>
      <header className="sticky top-0 z-20 flex min-h-[76px] items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
        {/* Workspace information and mobile menu */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={
              mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={mobileMenuOpen}
            aria-controls="admin-mobile-sidebar"
            className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 lg:hidden"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-slate-800 sm:text-base">
              Healthcare Data Integration
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Administrator Workspace
            </p>
          </div>
        </div>

        {/* Account actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Badge
            variant="outline"
            className="hidden border-teal-200 bg-teal-50 text-teal-800 sm:inline-flex"
          >
            Live API
          </Badge>

          <div className="hidden h-8 w-px bg-slate-200 sm:block" />

          <div className="flex items-center gap-2">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-sm font-semibold text-teal-800">
              AD
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-800">
                Administrator
              </p>

              <p className="text-xs text-slate-500">System Management</p>
            </div>

            <ShieldCheck size={17} className="hidden text-teal-600 sm:block" />
          </div>

          <div className="mx-1 hidden h-8 w-px bg-slate-200 sm:block" />

          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label="Log out"
            onClick={openLogoutConfirmation}
            className="h-9 cursor-pointer gap-2 border-slate-200 text-slate-600 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      {/* Logout confirmation modal */}
      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent className="max-w-[420px] gap-0 rounded-xl p-6">
          <AlertDialogHeader>
            <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <LogOut size={21} />
            </div>

            <AlertDialogTitle className="text-lg font-semibold tracking-tight text-slate-900">
              Log out of CareBridge?
            </AlertDialogTitle>

            <AlertDialogDescription className="pt-1 text-sm leading-6 text-slate-500">
              Are you sure you want to log out of the administrator workspace?
              You will be returned to the login page.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
            <p className="text-xs leading-5 text-amber-800">
              Logging out clears this browser session&apos;s access token. The
              backend must independently validate tokens and enforce access
              permissions.
            </p>
          </div>

          <AlertDialogFooter className="mt-6 flex-row gap-2 sm:justify-end">
            <AlertDialogCancel className="mt-0 cursor-pointer border-slate-200">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleLogout}
              className="cursor-pointer bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-600"
            >
              <LogOut size={15} className="mr-2" />
              Yes, log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
