"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useRegistration } from "@/components/registration/use-registration";
import { PatientRegistrationDialog } from "@/components/registration/patients/patient-registration-dialog";
import { PatientEditDialog } from "@/components/registration/patients/patient-edit-dialog";
import type {
  PatientRegistration,
  RegistrationStatus,
} from "@/types/registration-dashboard/registration";

type StatusFilter = "All" | RegistrationStatus;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getStatusStyle(status: RegistrationStatus) {
  switch (status) {
    case "Complete":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "Pending Review":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "Incomplete":
      return "border-rose-200 bg-rose-50 text-rose-700";
  }
}

export function PatientRegistryView() {
  const {
    registrations,
    registerPatient,
    updatePatient,
    deletePatient,
    isLoading,
    error,
  } = useRegistration();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeSummaryIndex, setActiveSummaryIndex] = useState(0);

  const [viewPatient, setViewPatient] = useState<PatientRegistration | null>(
    null,
  );
  const [editPatient, setEditPatient] = useState<PatientRegistration | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<PatientRegistration | null>(
    null,
  );

  // Lock background scrolling whenever any modal is active.
  useEffect(() => {
    const isModalOpen =
      dialogOpen ||
      Boolean(viewPatient) ||
      Boolean(editPatient) ||
      Boolean(deleteTarget);

    if (!isModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";

    // Prevent horizontal layout shifting when the scrollbar disappears.
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [dialogOpen, viewPatient, editPatient, deleteTarget]);

  const completeCount = registrations.filter(
    (patient) => patient.status === "Complete",
  ).length;

  const pendingCount = registrations.filter(
    (patient) => patient.status === "Pending Review",
  ).length;

  const incompleteCount = registrations.filter(
    (patient) => patient.status === "Incomplete",
  ).length;

  const filteredRegistrations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...registrations]
      .sort(
        (a, b) =>
          new Date(b.registeredAt).getTime() -
          new Date(a.registeredAt).getTime(),
      )
      .filter((patient) => {
        const matchesSearch = [
          patient.patientId,
          patient.fullName,
          patient.email,
          patient.contactNumber,
          patient.status,
        ].some((value) => value.toLowerCase().includes(query));

        const matchesStatus =
          statusFilter === "All" || patient.status === statusFilter;

        return matchesSearch && matchesStatus;
      });
  }, [registrations, search, statusFilter]);

  const handleRegisterPatient = async (patient: PatientRegistration) => {
    setNotice("");

    // Allow the registration dialog to catch failures and remain open.
    const savedPatient = await registerPatient(patient);

    setSearch("");
    setStatusFilter("All");
    setNotice(`${savedPatient.fullName} was registered successfully.`);
  };

  const handleUpdatePatient = async (patient: PatientRegistration) => {
    setNotice("");

    // Let the edit dialog handle errors and close only after success.
    const savedPatient = await updatePatient(patient);

    setNotice(
      `${savedPatient.fullName}'s information was updated successfully.`,
    );
  };

  const handleDeletePatient = async () => {
    if (!deleteTarget || isDeleting) return;

    const deletedName = deleteTarget.fullName;

    setNotice("");
    setIsDeleting(true);

    try {
      await deletePatient(deleteTarget.id);

      setDeleteTarget(null);
      setViewPatient(null);
      setNotice(`${deletedName} was deleted successfully.`);
    } catch {
      // The provider displays the API error.
      // Keep the confirmation dialog open for a retry.
    } finally {
      setIsDeleting(false);
    }
  };

  const summaryCards = [
    {
      title: "Total Patients",
      value: registrations.length,
      description: "Records in the active registry",
      icon: Users,
      iconStyle: "bg-blue-50 text-blue-700",
    },
    {
      title: "Complete Records",
      value: completeCount,
      description: "Registration marked complete",
      icon: CheckCircle2,
      iconStyle: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Pending Review",
      value: pendingCount,
      description: "Records awaiting review",
      icon: Clock3,
      iconStyle: "bg-amber-50 text-amber-700",
    },
    {
      title: "Incomplete Records",
      value: incompleteCount,
      description: "Records requiring completion",
      icon: FileText,
      iconStyle: "bg-rose-50 text-rose-700",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-teal-700">
            Registration Workspace
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Patient Registry
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage patient records, review registration status, and maintain
            contact information.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" />
          Register Patient
        </button>
      </section>

      <div
        role="note"
        className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700"
      >
        <p className="font-semibold text-slate-900">
          Patient records connected
        </p>
        <p className="mt-1">
          Patient registrations, updates, and deletions are processed through
          the backend API. Deleted records are handled by the backend&apos;s
          soft-delete operation.
        </p>
      </div>

      {notice && (
        <div
          role="status"
          className="flex items-start justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <p>{notice}</p>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
            className="cursor-pointer text-emerald-700 hover:text-emerald-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {isLoading && (
        <div
          role="status"
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
        >
          Loading patient records...
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <p className="font-semibold">
            Unable to complete the patient request
          </p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <section aria-label="Patient summary statistics">
        {/* Mobile: one card at a time with pagination */}
        <div className="sm:hidden">
          {summaryCards[activeSummaryIndex] &&
            (() => {
              const card = summaryCards[activeSummaryIndex];
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100/60"
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconStyle}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-500">
                    {card.title}
                  </p>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                    {card.value.toLocaleString()}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    {card.description}
                  </p>
                </article>
              );
            })()}

          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() =>
                setActiveSummaryIndex((current) => Math.max(0, current - 1))
              }
              disabled={activeSummaryIndex === 0}
              className="inline-flex cursor-pointer items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <div className="flex items-center justify-center gap-2">
              {summaryCards.map((card, index) => (
                <button
                  key={card.title}
                  type="button"
                  onClick={() => setActiveSummaryIndex(index)}
                  aria-label={`Show ${card.title}`}
                  aria-current={
                    activeSummaryIndex === index ? "page" : undefined
                  }
                  className={`h-2.5 cursor-pointer rounded-full transition-all ${
                    activeSummaryIndex === index
                      ? "w-6 bg-teal-600"
                      : "w-2.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                setActiveSummaryIndex((current) =>
                  Math.min(summaryCards.length - 1, current + 1),
                )
              }
              disabled={activeSummaryIndex === summaryCards.length - 1}
              className="inline-flex cursor-pointer items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>

          <p className="mt-2 text-center text-xs text-slate-500">
            {activeSummaryIndex + 1} of {summaryCards.length} summary cards
          </p>
        </div>

        {/* Tablet and desktop: show all cards */}
        <div className="hidden gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100/60"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconStyle}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <p className="mt-5 text-sm font-medium text-slate-500">
                  {card.title}
                </p>
                <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                  {card.value.toLocaleString()}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {card.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Patient Records */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100/60">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Patient Records
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Search by patient name, patient ID, email, or contact number.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search patient records..."
                aria-label="Search patient records"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
              aria-label="Filter patients by registration status"
              className="h-11 cursor-pointer rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 md:w-52"
            >
              <option value="All">All statuses</option>
              <option value="Complete">Complete</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Incomplete">Incomplete</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Patient
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Patient ID
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Contact Number
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Registered
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredRegistrations.map((patient) => (
                <tr
                  key={patient.id}
                  className="transition-colors hover:bg-slate-50/70"
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {patient.fullName}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {patient.email}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm font-medium text-slate-700">
                    {patient.patientId}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {patient.contactNumber}
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm text-slate-700">
                      {formatDate(patient.registeredAt)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatTime(patient.registeredAt)}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                        patient.status,
                      )}`}
                    >
                      {patient.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setViewPatient(patient)}
                        aria-label={`View ${patient.fullName}`}
                        title="View patient information"
                        className="cursor-pointer rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditPatient(patient)}
                        aria-label={`Edit ${patient.fullName}`}
                        title="Edit patient"
                        className="cursor-pointer rounded-lg p-2 text-slate-500 transition hover:bg-teal-50 hover:text-teal-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(patient)}
                        aria-label={`Delete ${patient.fullName}`}
                        title="Delete patient"
                        className="cursor-pointer rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!isLoading && filteredRegistrations.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    {search.trim() || statusFilter !== "All"
                      ? "No patient records match your search and filter."
                      : "No patient records found. Register a patient to get started."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {filteredRegistrations.length} of {registrations.length}{" "}
            patient records
          </span>
          <span>Connected to patient records API</span>
        </div>
      </section>

      {/* Register Patient Modal */}
      <PatientRegistrationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        existingRegistrations={registrations}
        onRegister={handleRegisterPatient}
      />

      {/* Edit Patient Modal */}
      {editPatient && (
        <PatientEditDialog
          key={editPatient.id}
          patient={editPatient}
          existingRegistrations={registrations}
          onClose={() => setEditPatient(null)}
          onSave={handleUpdatePatient}
        />
      )}

      {/* View Patient Modal */}
      {viewPatient && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setViewPatient(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="patient-details-title"
            className="flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex shrink-0 items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h3
                  id="patient-details-title"
                  className="text-lg font-semibold text-slate-900"
                >
                  Patient Information
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {viewPatient.patientId}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setViewPatient(null)}
                aria-label="Close patient information"
                className="cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Full Name
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {viewPatient.fullName}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Email Address
                </p>
                <p className="mt-1 break-all text-sm text-slate-700">
                  {viewPatient.email}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Contact Number
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {viewPatient.contactNumber}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Address
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {viewPatient.address}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Gender
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    {viewPatient.gender}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Civil Status
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    {viewPatient.civilStatus}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Religion
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {viewPatient.religion}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Registration Date
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {formatDate(viewPatient.registeredAt)} at{" "}
                  {formatTime(viewPatient.registeredAt)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Registration Status
                </p>
                <span
                  className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                    viewPatient.status,
                  )}`}
                >
                  {viewPatient.status}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <button
                type="button"
                onClick={() => {
                  setEditPatient(viewPatient);
                  setViewPatient(null);
                }}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                <Pencil className="h-4 w-4" />
                Edit Information
              </button>

              <button
                type="button"
                onClick={() => setViewPatient(null)}
                className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Delete Patient Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isDeleting) {
              setDeleteTarget(null);
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-patient-title"
            aria-describedby="delete-patient-description"
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <h3
              id="delete-patient-title"
              className="mt-4 text-lg font-semibold text-slate-900"
            >
              Delete Patient Record
            </h3>

            <p
              id="delete-patient-description"
              className="mt-2 text-sm leading-6 text-slate-600"
            >
              Are you sure you want to remove{" "}
              <span className="font-semibold text-slate-900">
                {deleteTarget.fullName}
              </span>{" "}
              ({deleteTarget.patientId}) from the active registry?
            </p>

            <p className="mt-3 text-xs leading-5 text-slate-500">
              The backend will soft-delete the patient record so it can be
              excluded from the active registry.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeletePatient}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete Patient"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
