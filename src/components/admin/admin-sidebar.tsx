"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  LayoutDashboard,
  LogOut,
  ScrollText,
  ShieldCheck,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

import { AUTH_ROLE_KEY, AUTH_TOKEN_KEY } from "@/lib/api";
import { useAdminNavigation } from "@/components/admin/admin-navigation-context";

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

const navigation: {
  label: string;
  href: string;
  icon: LucideIcon;
}[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "User Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Audit Logs",
    href: "/admin/audit-logs",
    icon: ScrollText,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { mobileMenuOpen, setMobileMenuOpen } = useAdminNavigation();
  const [logoutOpen, setLogoutOpen] = useState(false);

  function isNavigationActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

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

  useEffect(() => {
    if (!mobileMenuOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen, setMobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  const navigationLinks = (
    <>
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = isNavigationActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            onClick={() => setMobileMenuOpen(false)}
            className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              isActive
                ? "bg-teal-600/15 font-medium text-teal-300"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon size={18} strokeWidth={1.9} />
            {item.label}
          </Link>
        );
      })}
    </>
  );

  const bottomSection = (
    <div className="mt-auto shrink-0 space-y-3 border-t border-white/10 p-4">
      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
        <div className="mb-2 flex items-center gap-2">
          <ShieldCheck size={16} className="text-teal-400" />
          <span className="text-xs font-semibold text-white">
            Account Management
          </span>
        </div>

        <p className="text-xs leading-5 text-slate-400">
          Staff account changes are submitted to the CareBridge backend. Other
          sections may still use demonstration records.
        </p>
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={openLogoutConfirmation}
        className="h-10 w-full cursor-pointer justify-start gap-3 text-slate-400 hover:bg-rose-500/10 hover:text-rose-300"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </Button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar: visible only on large screens */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-slate-950 text-slate-300 lg:flex">
        <div className="flex h-[76px] shrink-0 items-center gap-3 border-b border-white/10 px-5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-teal-600 text-white">
            <Activity size={22} />
          </div>

          <div>
            <h2 className="font-semibold tracking-tight text-white">
              CareBridge
            </h2>
            <p className="text-xs text-slate-400">Healthcare Data Platform</p>
          </div>
        </div>

        <nav
          aria-label="Administrator navigation"
          className="flex-1 space-y-1 overflow-y-auto px-3 py-6"
        >
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Administration
          </p>

          {navigationLinks}
        </nav>

        {bottomSection}
      </aside>

      {/* Mobile Sidebar: completely hidden until the hamburger is clicked */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 size-full cursor-pointer bg-slate-950/50"
          />

          {/* Slide-out sidebar */}
          <aside
            id="admin-mobile-sidebar"
            role="dialog"
            aria-modal="true"
            aria-label="Administrator navigation menu"
            className="absolute inset-y-0 left-0 flex w-[min(20rem,85vw)] flex-col overflow-y-auto bg-slate-950 text-slate-300 shadow-2xl"
          >
            <div className="flex h-[76px] shrink-0 items-center justify-between gap-3 border-b border-white/10 px-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white">
                  <Activity size={22} />
                </div>

                <div className="min-w-0">
                  <h2 className="font-semibold tracking-tight text-white">
                    CareBridge
                  </h2>
                  <p className="text-xs text-slate-400">
                    Healthcare Data Platform
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <nav
              aria-label="Administrator mobile navigation"
              className="space-y-1 px-3 py-6"
            >
              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Administration
              </p>

              {navigationLinks}
            </nav>

            {bottomSection}
          </aside>
        </div>
      )}

      {/* Logout Confirmation Modal */}
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
              Logging out clears this browser session&apos;s access token and
              saved role. The backend remains responsible for validating tokens
              and enforcing access permissions.
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
