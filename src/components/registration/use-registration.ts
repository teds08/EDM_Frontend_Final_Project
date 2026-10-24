"use client";

import { useContext } from "react";
import { RegistrationContext } from "@/components/registration/registration-context";

export function useRegistration() {
  const context = useContext(RegistrationContext);

  if (!context) {
    throw new Error(
      "useRegistration must be used within a RegistrationProvider.",
    );
  }

  return context;
}
