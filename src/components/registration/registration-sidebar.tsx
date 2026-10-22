"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Users,
} from "lucide-react";
import { AUTH_ROLE_KEY, AUTH_TOKEN_KEY } from "@/lib/api";

export function RegistrationSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const dashboardActive = pathname === "/registration/dashboard";
  const patientsActive = pathname.startsWith("/registration/patients");

  const handleLogout = () => {
    window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
    window.sessionStorage.removeItem(AUTH_ROLE_KEY);
    router.replace("/login");
  };

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
  ];

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white">
            <Activity className="h-5 w-5" />
          </div>

          <div>
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

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={item.active ? "page" : undefined}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                    item.active
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className="mb-3 rounded-xl border border-teal-100 bg-teal-50/70 p-3">
            <div className="mb-2 flex items-center gap-2 text-teal-800">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs font-semibold">Demo Workspace</span>
            </div>
            <p className="text-xs leading-5 text-slate-600">
              Registration changes are temporary and are not saved to the
              database.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <nav className="sticky top-0 z-30 flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2 lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                item.active
                  ? "bg-teal-50 text-teal-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={handleLogout}
          className="ml-auto flex shrink-0 cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </nav>
    </>
  );
}
