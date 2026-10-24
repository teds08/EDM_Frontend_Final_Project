"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Users,
  X,
} from "lucide-react";

import { AUTH_ROLE_KEY, AUTH_TOKEN_KEY } from "@/lib/api";
import { useRegistrationNavigation } from "@/components/registration/registration-navigation-context";

export function RegistrationSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { mobileMenuOpen, setMobileMenuOpen } = useRegistrationNavigation();

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const dashboardActive = pathname.startsWith("/registration/dashboard");
  const patientsActive = pathname.startsWith("/registration/patients");
  const auditLogsActive = pathname.startsWith("/registration/audit-logs");

  const navItems = [
    {
      label: "Dashboard",
      href: "/registration/dashboard",
      icon: LayoutDashboard,
      active: dashboardActive,
    },
    {
      label: "Patient Registry",
      href: "/registration/patients",
      icon: Users,
      active: patientsActive,
    },
    {
      label: "Audit Logs",
      href: "/registration/audit-logs",
      icon: ClipboardList,
      active: auditLogsActive,
    },
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      if (logoutDialogOpen) {
        setLogoutDialogOpen(false);
      } else if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [logoutDialogOpen, mobileMenuOpen, setMobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  const handleLogout = () => {
    setLogoutDialogOpen(false);
    setMobileMenuOpen(false);

    window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
    window.sessionStorage.removeItem(AUTH_ROLE_KEY);

    router.replace("/login");
  };

  const navigationLinks = (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={item.active ? "page" : undefined}
            onClick={() => setMobileMenuOpen(false)}
            className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
              item.active
                ? "bg-teal-50 text-teal-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </>
  );

  const bottomSection = (
    <div className="mt-auto border-t border-slate-100 p-4">
      <button
        type="button"
        onClick={() => setLogoutDialogOpen(true)}
        className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
      >
        <LogOut className="h-4 w-4 shrink-0" />
        Sign Out
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-20 shrink-0 items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white">
            <Activity className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="text-base font-bold tracking-tight text-slate-900">
              CareBridge
            </p>

            <p className="text-xs text-slate-500">
              Healthcare Data Integration
            </p>
          </div>
        </div>

        <div className="px-4 pt-6">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Registration Workspace
          </p>

          <nav aria-label="Registration staff navigation" className="space-y-1">
            {navigationLinks}
          </nav>
        </div>

        {bottomSection}
      </aside>

      {/* Mobile Sidebar and Backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 cursor-pointer bg-slate-950/40"
          />

          <aside
            id="registration-mobile-sidebar"
            aria-label="Registration staff mobile navigation"
            className="absolute inset-y-0 left-0 flex w-[min(20rem,85vw)] flex-col border-r border-slate-200 bg-white shadow-2xl"
          >
            {/* Mobile Branding */}
            <div className="flex h-20 shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white">
                  <Activity className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-base font-bold tracking-tight text-slate-900">
                    CareBridge
                  </p>

                  <p className="text-xs text-slate-500">
                    Healthcare Data Integration
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <div className="px-4 pt-6">
              <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Registration Workspace
              </p>

              <nav
                aria-label="Registration staff mobile links"
                className="space-y-1"
              >
                {navigationLinks}
              </nav>
            </div>

            {bottomSection}
          </aside>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {logoutDialogOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setLogoutDialogOpen(false);
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="registration-logout-title"
            aria-describedby="registration-logout-description"
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <div className="flex size-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <h2
              id="registration-logout-title"
              className="mt-4 text-lg font-semibold text-slate-900"
            >
              Confirm Sign Out
            </h2>

            <p
              id="registration-logout-description"
              className="mt-2 text-sm leading-6 text-slate-600"
            >
              Are you sure you want to sign out of your CareBridge Registration
              Staff account? You will need to sign in again to access your
              workspace.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                autoFocus
                onClick={() => setLogoutDialogOpen(false)}
                className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
              >
                <LogOut className="h-4 w-4" />
                Yes, Sign Out
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
