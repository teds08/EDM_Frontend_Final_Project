"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, LoaderCircle, Pencil, X } from "lucide-react";
import type {
  CivilStatus,
  Gender,
  PatientRegistration,
  RegistrationStatus,
  Religion,
} from "@/types/registration-dashboard/registration";

interface PatientEditDialogProps {
  patient: PatientRegistration;
  existingRegistrations: PatientRegistration[];
  onClose: () => void;
  onSave: (patient: PatientRegistration) => Promise<PatientRegistration | void>;
}

const fieldClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";

const labelClassName = "mb-2 block text-sm font-medium text-slate-700";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to update the patient. Please try again.";
}

export function PatientEditDialog({
  patient,
  existingRegistrations,
  onClose,
  onSave,
}: PatientEditDialogProps) {
  const [fullName, setFullName] = useState(patient.fullName);
  const [email, setEmail] = useState(patient.email);
  const [contactNumber, setContactNumber] = useState(patient.contactNumber);
  const [address, setAddress] = useState(patient.address);
  const [gender, setGender] = useState<Gender>(patient.gender);
  const [religion, setReligion] = useState<Religion>(patient.religion);
  const [civilStatus, setCivilStatus] = useState<CivilStatus>(
    patient.civilStatus,
  );
  const [status, setStatus] = useState<RegistrationStatus>(patient.status);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    const normalizedName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = contactNumber.trim();
    const normalizedAddress = address.trim();
    const phoneDigits = normalizedPhone.replace(/\D/g, "");

    if (
      !normalizedName ||
      !normalizedEmail ||
      !normalizedPhone ||
      !normalizedAddress
    ) {
      setError("Please complete all required fields.");
      return;
    }

    const duplicate = existingRegistrations.some((existing) => {
      if (existing.id === patient.id) return false;

      const emailMatches =
        existing.email.trim().toLowerCase() === normalizedEmail;

      const existingPhone = existing.contactNumber.replace(/\D/g, "");
      const phoneMatches =
        phoneDigits.length > 0 && existingPhone === phoneDigits;

      return emailMatches || phoneMatches;
    });

    if (duplicate) {
      setError(
        "Another patient already uses this email address or contact number.",
      );
      return;
    }

    const updatedPatient: PatientRegistration = {
      ...patient,
      fullName: normalizedName,
      email: normalizedEmail,
      contactNumber: normalizedPhone,
      address: normalizedAddress,
      gender,
      religion,
      civilStatus,
      status,
    };

    setIsSubmitting(true);
    setError("");

    try {
      await onSave(updatedPatient);
      onClose();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-patient-title"
        className="flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex shrink-0 items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Pencil className="h-5 w-5" />
            </div>

            <div>
              <h2
                id="edit-patient-title"
                className="text-lg font-semibold text-slate-900"
              >
                Edit Patient Information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Patient ID: {patient.patientId}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close edit form"
            className="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
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
              <label htmlFor="edit-patient-name" className={labelClassName}>
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-patient-name"
                required
                maxLength={150}
                autoComplete="name"
                disabled={isSubmitting}
                value={fullName}
                onChange={(event) => {
                  setFullName(event.target.value);
                  setError("");
                }}
                className={fieldClassName}
              />
            </div>

            <div>
              <label htmlFor="edit-patient-email" className={labelClassName}>
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-patient-email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                disabled={isSubmitting}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                className={fieldClassName}
              />
            </div>

            <div>
              <label htmlFor="edit-patient-contact" className={labelClassName}>
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-patient-contact"
                type="tel"
                required
                maxLength={30}
                autoComplete="tel"
                disabled={isSubmitting}
                value={contactNumber}
                onChange={(event) => {
                  setContactNumber(event.target.value);
                  setError("");
                }}
                className={fieldClassName}
              />
            </div>

            <div>
              <label htmlFor="edit-patient-address" className={labelClassName}>
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="edit-patient-address"
                autoComplete="street-address"
                required
                maxLength={300}
                rows={3}
                disabled={isSubmitting}
                value={address}
                onChange={(event) => {
                  setAddress(event.target.value);
                  setError("");
                }}
                className={`${fieldClassName} resize-y`}
              />
            </div>

            <div>
              <label htmlFor="edit-patient-gender" className={labelClassName}>
                Gender
              </label>
              <select
                id="edit-patient-gender"
                disabled={isSubmitting}
                value={gender}
                onChange={(event) => {
                  setGender(event.target.value as Gender);
                  setError("");
                }}
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
              <label htmlFor="edit-patient-religion" className={labelClassName}>
                Religion{" "}
                <span className="text-xs text-slate-400">(Optional)</span>
              </label>
              <select
                id="edit-patient-religion"
                disabled={isSubmitting}
                value={religion}
                onChange={(event) => {
                  setReligion(event.target.value as Religion);
                  setError("");
                }}
                className={`${fieldClassName} cursor-pointer`}
              >
                <option value="Prefer not to say">Prefer not to say</option>
                <option value="Catholic">Catholic</option>
                <option value="Christian">Christian</option>
                <option value="Islam">Islam</option>
                <option value="Iglesia ni Cristo">Iglesia ni Cristo</option>
                <option value="Atheist">Atheist</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="edit-patient-civil-status"
                className={labelClassName}
              >
                Civil Status
              </label>
              <select
                id="edit-patient-civil-status"
                disabled={isSubmitting}
                value={civilStatus}
                onChange={(event) => {
                  setCivilStatus(event.target.value as CivilStatus);
                  setError("");
                }}
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

            <div>
              <label htmlFor="edit-patient-status" className={labelClassName}>
                Registration Status
              </label>
              <select
                id="edit-patient-status"
                disabled={isSubmitting}
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value as RegistrationStatus);
                  setError("");
                }}
                className={`${fieldClassName} cursor-pointer`}
              >
                <option value="Complete">Complete</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Incomplete">Incomplete</option>
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
              Changes are submitted to the backend and saved only when the
              update request succeeds.
            </p>
          </div>

          <div className="flex shrink-0 justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Pencil className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
