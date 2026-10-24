"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface RegistrationNavigationContextValue {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const RegistrationNavigationContext =
  createContext<RegistrationNavigationContextValue | null>(null);

export function RegistrationNavigationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <RegistrationNavigationContext.Provider
      value={{ mobileMenuOpen, setMobileMenuOpen }}
    >
      {children}
    </RegistrationNavigationContext.Provider>
  );
}

export function useRegistrationNavigation() {
  const context = useContext(RegistrationNavigationContext);

  if (!context) {
    throw new Error(
      "Registration navigation components must be used within RegistrationNavigationProvider.",
    );
  }

  return context;
}
