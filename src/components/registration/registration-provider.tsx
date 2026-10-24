"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { patientsApi } from "@/lib/api/patients";
import type { PatientApiRecord, PatientPayload } from "@/lib/api/patients";
import {
  RegistrationContext,
  type RegistrationContextValue,
} from "@/components/registration/registration-context";
import type {
  CivilStatus,
  Gender,
  PatientRegistration,
  RegistrationStatus,
  Religion,
} from "@/types/registration-dashboard/registration";

interface RegistrationProviderProps {
  children: ReactNode;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
}

function toPatientRegistration(record: PatientApiRecord): PatientRegistration {
  return {
    id: String(record.id),
    patientId: record.patientId,
    fullName: record.fullName,
    email: record.email,
    contactNumber: record.contactNumber,
    address: record.address,
    gender: record.gender as Gender,
    religion: record.religion as Religion,
    civilStatus: record.civilStatus as CivilStatus,
    registeredAt: record.registeredAt,
    status: record.status as RegistrationStatus,
  };
}

function getPatientPayload(patient: PatientRegistration): PatientPayload {
  return {
    fullName: patient.fullName,
    email: patient.email,
    contactNumber: patient.contactNumber,
    address: patient.address,
    gender: patient.gender,
    religion: patient.religion,
    civilStatus: patient.civilStatus,
  };
}

async function fetchAllPatientRegistrations(): Promise<PatientRegistration[]> {
  const firstPage = await patientsApi.getAll();

  if (!Array.isArray(firstPage.data)) {
    throw new Error("The patient API returned an unexpected response.");
  }

  const records: PatientApiRecord[] = [...firstPage.data];

  for (let page = 2; page <= firstPage.pagination.totalPages; page += 1) {
    const nextPage = await patientsApi.getAll({
      page,
      limit: firstPage.pagination.limit,
    });

    records.push(...nextPage.data);
  }

  return records.map(toPatientRegistration);
}

export function RegistrationProvider({ children }: RegistrationProviderProps) {
  const [registrations, setRegistrations] = useState<PatientRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial fetch. State updates run after the asynchronous request resolves.
  useEffect(() => {
    let cancelled = false;

    fetchAllPatientRegistrations()
      .then((records) => {
        if (cancelled) return;

        setRegistrations(records);
        setError(null);
      })
      .catch((requestError: unknown) => {
        if (cancelled) return;

        setError(getErrorMessage(requestError));
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const refreshRegistrations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const records = await fetchAllPatientRegistrations();
      setRegistrations(records);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      throw requestError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const registerPatient = useCallback(
    async (patient: PatientRegistration): Promise<PatientRegistration> => {
      setError(null);

      try {
        const response = await patientsApi.create(getPatientPayload(patient));

        const savedPatient = toPatientRegistration(response.data);

        setRegistrations((current) => [
          savedPatient,
          ...current.filter((existing) => existing.id !== savedPatient.id),
        ]);

        return savedPatient;
      } catch (requestError) {
        setError(getErrorMessage(requestError));
        throw requestError;
      }
    },
    [],
  );

  const updatePatient = useCallback(
    async (patient: PatientRegistration): Promise<PatientRegistration> => {
      const databaseId = Number(patient.id);

      if (!Number.isInteger(databaseId) || databaseId <= 0) {
        throw new Error("The patient database ID is invalid.");
      }

      setError(null);

      try {
        const existingPatient = registrations.find(
          (current) => current.id === String(databaseId),
        );

        if (!existingPatient) {
          throw new Error(
            "Patient not found in the active registry. Refresh the patient list and try again.",
          );
        }

        const payload = getPatientPayload(patient);

        const detailsChanged =
          existingPatient.fullName !== payload.fullName ||
          existingPatient.email !== payload.email ||
          existingPatient.contactNumber !== payload.contactNumber ||
          existingPatient.address !== payload.address ||
          existingPatient.gender !== payload.gender ||
          existingPatient.religion !== payload.religion ||
          existingPatient.civilStatus !== payload.civilStatus;

        const statusChanged = existingPatient.status !== patient.status;

        let savedPatient = existingPatient;

        if (detailsChanged) {
          const response = await patientsApi.update(databaseId, payload);

          savedPatient = toPatientRegistration(response.data);

          setRegistrations((current) =>
            current.map((record) =>
              record.id === savedPatient.id ? savedPatient : record,
            ),
          );
        }

        if (statusChanged) {
          const response = await patientsApi.updateStatus(
            databaseId,
            patient.status,
          );

          savedPatient = toPatientRegistration(response.data);
        }

        if (detailsChanged || statusChanged) {
          setRegistrations((current) =>
            current.map((record) =>
              record.id === savedPatient.id ? savedPatient : record,
            ),
          );
        }

        return savedPatient;
      } catch (requestError) {
        setError(getErrorMessage(requestError));
        throw requestError;
      }
    },
    [registrations],
  );

  const deletePatient = useCallback(
    async (patientId: string): Promise<void> => {
      const databaseId = Number(patientId);

      if (!Number.isInteger(databaseId) || databaseId <= 0) {
        throw new Error("The patient database ID is invalid.");
      }

      setError(null);

      try {
        await patientsApi.delete(databaseId);

        setRegistrations((current) =>
          current.filter((patient) => patient.id !== String(databaseId)),
        );
      } catch (requestError) {
        setError(getErrorMessage(requestError));
        throw requestError;
      }
    },
    [],
  );

  const value = useMemo<RegistrationContextValue>(
    () => ({
      registrations,
      isLoading,
      error,
      refreshRegistrations,
      registerPatient,
      updatePatient,
      deletePatient,
    }),
    [
      registrations,
      isLoading,
      error,
      refreshRegistrations,
      registerPatient,
      updatePatient,
      deletePatient,
    ],
  );

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
}
