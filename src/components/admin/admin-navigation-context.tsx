"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface AdminNavigationContextValue {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const AdminNavigationContext =
  createContext<AdminNavigationContextValue | null>(null);

export function AdminNavigationProvider({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <AdminNavigationContext.Provider
      value={{ mobileMenuOpen, setMobileMenuOpen }}
    >
      {children}
    </AdminNavigationContext.Provider>
  );
}

export function useAdminNavigation() {
  const context = useContext(AdminNavigationContext);

  if (!context) {
    throw new Error(
      "Admin navigation components must be used within AdminNavigationProvider.",
    );
  }

  return context;
}
