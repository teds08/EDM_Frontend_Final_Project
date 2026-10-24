"use client";

import { createContext } from "react";
import type { PatientRegistration } from "@/types/registration-dashboard/registration";

export interface RegistrationContextValue {
  registrations: PatientRegistration[];
  isLoading: boolean;
  error: string | null;
  refreshRegistrations: () => Promise<void>;
  registerPatient: (
    patient: PatientRegistration,
  ) => Promise<PatientRegistration>;
  updatePatient: (patient: PatientRegistration) => Promise<PatientRegistration>;
  deletePatient: (patientId: string) => Promise<void>;
}

export const RegistrationContext =
  createContext<RegistrationContextValue | null>(null);
