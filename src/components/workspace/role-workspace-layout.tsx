"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  CreditCard,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { AUTH_ROLE_KEY, AUTH_TOKEN_KEY } from "@/lib/api";

type WorkspaceRole = "Laboratory Staff" | "Billing Staff";

interface RoleWorkspaceLayoutProps {
  role: WorkspaceRole;
  children: ReactNode;
}

const workspaceConfig = {
  "Laboratory Staff": {
    basePath: "/laboratory",
    dashboardPath: "/laboratory/dashboard",
    icon: Stethoscope,
  },
  "Billing Staff": {
    basePath: "/billing",
    dashboardPath: "/billing/dashboard",
    icon: CreditCard,
  },
} satisfies Record<
  WorkspaceRole,
  {
    basePath: string;
    dashboardPath: string;
    icon: typeof Stethoscope;
  }
>;

export function RoleWorkspaceLayout({
  role,
  children,
}: RoleWorkspaceLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const config = workspaceConfig[role];
  const RoleIcon = config.icon;

  const handleLogout = () => {
    window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
    window.sessionStorage.removeItem(AUTH_ROLE_KEY);
    router.replace("/login");
  };

  const dashboardActive = pathname === config.dashboardPath;

  return (
    <div className="min-h-screen bg-slate-50">
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
            Staff Workspace
          </p>

          <Link
            href={config.dashboardPath}
            className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
              dashboardActive
                ? "bg-teal-50 text-teal-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </div>

        <div className="mt-auto p-4">
          <div className="mb-3 rounded-xl border border-teal-100 bg-teal-50/70 p-3">
            <div className="mb-2 flex items-center gap-2 text-teal-800">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs font-semibold">Staff Workspace</span>
            </div>
            <p className="text-xs leading-5 text-slate-600">
              Your workspace is separated from the Admin dashboard.
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

      <div className="min-w-0 lg:pl-64">
        <nav className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <Link
            href={config.dashboardPath}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-teal-700 hover:bg-teal-50"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </nav>

        <header className="flex min-h-20 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-medium text-slate-500">
              CareBridge / {role}
            </p>
            <h1 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
              {role}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 sm:inline-flex">
              <ShieldCheck className="h-4 w-4" />
              Staff Access
            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-teal-800">
              <RoleIcon className="h-4 w-4" />
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
