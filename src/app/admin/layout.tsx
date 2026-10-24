import type { ReactNode } from "react";

import { AuthGuard } from "@/components/auth/auth-guard";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminNavigationProvider } from "@/components/admin/admin-navigation-context";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AuthGuard requiredRole="ADMIN">
      <AdminNavigationProvider>
        <div className="min-h-screen bg-slate-50">
          <AdminSidebar />

          <div className="min-w-0 lg:pl-64">
            <AdminHeader />

            <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </AdminNavigationProvider>
    </AuthGuard>
  );
}
