"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AlertCircle, UserPlus, X } from "lucide-react";
import type {
  CivilStatus,
  Gender,
  PatientRegistration,
  RegistrationStatus,
  Religion,
} from "@/types/registration-dashboard/registration";

interface PatientRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingRegistrations: PatientRegistration[];
  onRegister: (patient: PatientRegistration) => void;
}

interface PatientFormValues {
  fullName: string;
  email: string;
  contactNumber: string;
  address: string;
  gender: Gender;
  religion: Religion;
  civilStatus: CivilStatus;
}

const initialValues: PatientFormValues = {
  fullName: "",
  email: "",
  contactNumber: "",
  address: "",
  gender: "Prefer not to say",
  religion: "Prefer not to say",
  civilStatus: "Prefer not to say",
};

const fieldClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

const labelClassName = "mb-2 block text-sm font-medium text-slate-700";

export function PatientRegistrationDialog({
  open,
  onOpenChange,
  existingRegistrations,
  onRegister,
}: PatientRegistrationDialogProps) {
  const [values, setValues] = useState<PatientFormValues>(initialValues);
  const [error, setError] = useState("");

  const closeDialog = () => {
    setValues(initialValues);
    setError("");
    onOpenChange(false);
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setValues(initialValues);
        setError("");
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  const updateField = <K extends keyof PatientFormValues>(
    field: K,
    value: PatientFormValues[K],
  ) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
    setError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fullName = values.fullName.trim();
    const email = values.email.trim().toLowerCase();
    const contactNumber = values.contactNumber.trim();
    const address = values.address.trim();

    if (!fullName || !email || !contactNumber || !address) {
      setError("Please complete all required fields.");
      return;
    }

    const submittedPhone = contactNumber.replace(/\D/g, "");

    const duplicate = existingRegistrations.some((patient) => {
      const emailMatches = patient.email.trim().toLowerCase() === email;

      const existingPhone = patient.contactNumber.replace(/\D/g, "");
      const phoneMatches =
        submittedPhone.length > 0 && existingPhone === submittedPhone;

      return emailMatches || phoneMatches;
    });

    if (duplicate) {
      setError(
        "A patient already uses this email address or contact number. Review the existing records before continuing.",
      );
      return;
    }

    const currentYear = new Date().getFullYear();

    const highestSequence = existingRegistrations.reduce((highest, patient) => {
      const match = patient.patientId.match(/(\d+)$/);

      return match ? Math.max(highest, Number(match[1])) : highest;
    }, 1000);

    const newPatient: PatientRegistration = {
      id: `reg-${Date.now()}`,
      patientId: `CB-${currentYear}-${highestSequence + 1}`,
      fullName,
      email,
      contactNumber,
      address,
      gender: values.gender,
      religion: values.religion,
      civilStatus: values.civilStatus,
      registeredAt: new Date().toISOString(),
      status: "Complete" satisfies RegistrationStatus,
    };

    onRegister(newPatient);
    closeDialog();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeDialog();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="patient-registration-title"
        className="flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex shrink-0 items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <UserPlus className="h-5 w-5" />
            </div>

            <div>
              <h2
                id="patient-registration-title"
                className="text-lg font-semibold text-slate-900"
              >
                Register Patient
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter patient information and demographics.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeDialog}
            aria-label="Close registration form"
            className="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-6 py-5">
            <div>
              <label htmlFor="patient-full-name" className={labelClassName}>
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="patient-full-name"
                type="text"
                autoComplete="name"
                required
                maxLength={150}
                value={values.fullName}
                onChange={(event) =>
                  updateField("fullName", event.target.value)
                }
                placeholder="Enter patient's full name"
                className={fieldClassName}
              />
            </div>

            <div>
              <label htmlFor="patient-email" className={labelClassName}>
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="patient-email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={values.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="patient@example.com"
                className={fieldClassName}
              />
            </div>

            <div>
              <label
                htmlFor="patient-contact-number"
                className={labelClassName}
              >
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                id="patient-contact-number"
                type="tel"
                autoComplete="tel"
                required
                maxLength={30}
                value={values.contactNumber}
                onChange={(event) =>
                  updateField("contactNumber", event.target.value)
                }
                placeholder="e.g. 09171234567"
                className={fieldClassName}
              />
            </div>

            <div>
              <label htmlFor="patient-address" className={labelClassName}>
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="patient-address"
                autoComplete="street-address"
                required
                maxLength={300}
                rows={3}
                value={values.address}
                onChange={(event) => updateField("address", event.target.value)}
                placeholder="House number, street, barangay, city, province"
                className={`${fieldClassName} resize-y`}
              />
            </div>

            <div>
              <label htmlFor="patient-gender" className={labelClassName}>
                Gender
              </label>
              <select
                id="patient-gender"
                value={values.gender}
                onChange={(event) =>
                  updateField("gender", event.target.value as Gender)
                }
                className={`${fieldClassName} cursor-pointer`}
              >
                <option value="Prefer not to say">Prefer not to say</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="patient-religion" className={labelClassName}>
                Religion{" "}
                <span className="text-xs text-slate-400">(Optional)</span>
              </label>
              <select
                id="patient-religion"
                value={values.religion}
                onChange={(event) =>
                  updateField("religion", event.target.value as Religion)
                }
                className={`${fieldClassName} cursor-pointer`}
              >
                <option value="Prefer not to say">Prefer not to say</option>
                <option value="Catholic">Catholic</option>
                <option value="Christian">Christian</option>
                <option value="Islam">Islam</option>
                <option value="Iglesia ni Cristo">Iglesia ni Cristo</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="patient-civil-status" className={labelClassName}>
                Civil Status
              </label>
              <select
                id="patient-civil-status"
                value={values.civilStatus}
                onChange={(event) =>
                  updateField("civilStatus", event.target.value as CivilStatus)
                }
                className={`${fieldClassName} cursor-pointer`}
              >
                <option value="Prefer not to say">Prefer not to say</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Separated">Separated</option>
                <option value="Divorced">Divorced</option>
              </select>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <p className="text-xs leading-5 text-slate-500">
              Demo mode: patient data is temporary and will not be saved to the
              backend or database. Only collect demographic information that is
              necessary for your system&apos;s purpose.
            </p>
          </div>

          <div className="flex shrink-0 justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
            <button
              type="button"
              onClick={closeDialog}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              <UserPlus className="h-4 w-4" />
              Register Patient
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
