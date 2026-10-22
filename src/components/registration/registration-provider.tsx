"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { recentRegistrations } from "@/data/registration-dashboard/dummy-data";
import type { PatientRegistration } from "@/types/registration-dashboard/registration";

interface RegistrationContextValue {
  registrations: PatientRegistration[];
  registerPatient: (patient: PatientRegistration) => void;
  updatePatient: (patient: PatientRegistration) => void;
  deletePatient: (patientId: string) => void;
}

const RegistrationContext = createContext<RegistrationContextValue | null>(
  null,
);

interface RegistrationProviderProps {
  children: ReactNode;
}

export function RegistrationProvider({ children }: RegistrationProviderProps) {
  const [registrations, setRegistrations] =
    useState<PatientRegistration[]>(recentRegistrations);

  const registerPatient = useCallback((patient: PatientRegistration) => {
    setRegistrations((current) => [patient, ...current]);
  }, []);

  const updatePatient = useCallback((updatedPatient: PatientRegistration) => {
    setRegistrations((current) =>
      current.map((patient) =>
        patient.id === updatedPatient.id ? updatedPatient : patient,
      ),
    );
  }, []);

  const deletePatient = useCallback((patientId: string) => {
    setRegistrations((current) =>
      current.filter((patient) => patient.id !== patientId),
    );
  }, []);

  const value = useMemo(
    () => ({
      registrations,
      registerPatient,
      updatePatient,
      deletePatient,
    }),
    [registrations, registerPatient, updatePatient, deletePatient],
  );

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);

  if (!context) {
    throw new Error(
      "useRegistration must be used within a RegistrationProvider.",
    );
  }

  return context;
}
