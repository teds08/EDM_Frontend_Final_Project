import type { ReactNode } from "react";

import { AuthGuard } from "@/components/auth/auth-guard";
import { RegistrationHeader } from "@/components/registration/registration-header";
import { RegistrationSidebar } from "@/components/registration/registration-sidebar";
import { RegistrationProvider } from "@/components/registration/registration-provider";
import { RegistrationNavigationProvider } from "@/components/registration/registration-navigation-context";

interface RegistrationLayoutProps {
  children: ReactNode;
}

export default function RegistrationLayout({
  children,
}: RegistrationLayoutProps) {
  return (
    <AuthGuard requiredRole="REGISTRATION">
      <RegistrationProvider>
        <RegistrationNavigationProvider>
          <div className="min-h-screen bg-slate-50">
            <RegistrationSidebar />

            <div className="min-w-0 lg:pl-64">
              <RegistrationHeader />

              <main className="mx-auto w-full max-w-[1600px] p-4 pb-8 sm:p-6 lg:p-8">
                {children}
              </main>
            </div>
          </div>
        </RegistrationNavigationProvider>
      </RegistrationProvider>
    </AuthGuard>
  );
}
