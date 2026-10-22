"use client";

import { useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  FileText,
  Plus,
  RefreshCw,
  Search,
  UserPlus,
  Users,
} from "lucide-react";
import {
  recentRegistrations,
  registrationDashboardStats,
} from "@/data/registration-dashboard/dummy-data";
import { PatientRegistrationDialog } from "@/components/registration/patients/patient-registration-dialog";
import { useRegistration } from "@/components/registration/registration-provider";
import type {
  PatientRegistration,
  RegistrationStatus,
} from "@/types/registration-dashboard/registration";

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

export function RegistrationDashboardView() {
  const { registrations, registerPatient } = useRegistration();

  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [isRegistrationDialogOpen, setIsRegistrationDialogOpen] =
    useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLElement>(null);

  const newRegistrationCount = Math.max(
    0,
    registrations.length - recentRegistrations.length,
  );

  const stats = [
    {
      title: "Total Patients",
      value: (
        registrationDashboardStats.totalPatients + newRegistrationCount
      ).toLocaleString(),
      description: "Patients in the sample registry",
      icon: Users,
      trend: "+8.2%",
      trendDirection: "up" as const,
      iconClass: "bg-blue-50 text-blue-700",
    },
    {
      title: "Registered Today",
      value: (
        registrationDashboardStats.registeredToday + newRegistrationCount
      ).toString(),
      description: "New registrations today",
      icon: UserPlus,
      trend: newRegistrationCount > 0 ? `+${newRegistrationCount}` : "+12.5%",
      trendDirection: "up" as const,
      iconClass: "bg-teal-50 text-teal-700",
    },
    {
      title: "Pending Records",
      value: registrationDashboardStats.pendingRecords.toString(),
      description: "Awaiting record review",
      icon: Clock3,
      trend: "Needs review",
      trendDirection: "down" as const,
      iconClass: "bg-amber-50 text-amber-700",
    },
    {
      title: "Records Updated Today",
      value: registrationDashboardStats.updatedToday.toString(),
      description: "Sample records updated",
      icon: RefreshCw,
      trend: "+4.6%",
      trendDirection: "up" as const,
      iconClass: "bg-violet-50 text-violet-700",
    },
  ];

  const filteredRegistrations = useMemo(() => {
    const query = search.trim().toLowerCase();

    const sortedRegistrations = [...registrations].sort(
      (a, b) =>
        new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime(),
    );

    if (!query) {
      return sortedRegistrations;
    }

    return sortedRegistrations.filter((patient) =>
      [
        patient.patientId,
        patient.fullName,
        patient.email,
        patient.contactNumber,
        patient.address,
        patient.gender,
        patient.religion,
        patient.civilStatus,
        patient.status,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [registrations, search]);

  const handleRegisterPatient = (patient: PatientRegistration) => {
    registerPatient(patient);
    setSearch("");

    setNotice(
      `${patient.fullName} was added to the demonstration registration list. This record has not been saved to the database.`,
    );
  };

  const focusSearch = () => {
    searchRef.current?.focus();

    setNotice(
      "Search by patient name, patient ID, email, contact number, or status.",
    );
  };

  const viewRecentRegistrations = () => {
    tableRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setNotice("Showing the recent sample registrations.");
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-teal-700">
            Registration Overview
          </p>

          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Review patient registration activity and monitor record completion
            from one workspace.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsRegistrationDialogOpen(true)}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" />
          Register Patient
        </button>
      </section>

      <div
        role="note"
        className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4"
      >
        <Activity className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />

        <div>
          <p className="text-sm font-semibold text-blue-900">
            Demonstration dashboard
          </p>

          <p className="mt-1 text-sm leading-5 text-blue-800">
            The figures and registration records are sample data. New
            registrations are temporarily shared between Registration pages and
            are not saved to the healthcare database.
          </p>
        </div>
      </div>

      {notice && (
        <div
          role="status"
          className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
        >
          <p>{notice}</p>

          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
            className="cursor-pointer text-slate-400 hover:text-slate-700"
          >
            ✕
          </button>
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          const TrendIcon =
            stat.trendDirection === "up" ? ArrowUpRight : ArrowDownRight;

          return (
            <article
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100/60"
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconClass}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                    stat.trendDirection === "up"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {stat.trendDirection === "up" && (
                    <TrendIcon className="h-3.5 w-3.5" />
                  )}

                  {stat.trend}
                </span>
              </div>

              <p className="mt-5 text-sm font-medium text-slate-500">
                {stat.title}
              </p>

              <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                {stat.value}
              </p>

              <p className="mt-2 text-xs text-slate-500">{stat.description}</p>
            </article>
          );
        })}
      </section>

      <section>
        <div className="mb-3">
          <h3 className="text-base font-semibold text-slate-900">
            Quick Actions
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Common tasks for the registration team.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <button
            type="button"
            onClick={() => setIsRegistrationDialogOpen(true)}
            className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-teal-300 hover:bg-teal-50/40"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <UserPlus className="h-5 w-5" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-slate-900">
                Register Patient
              </span>

              <span className="mt-1 block text-xs leading-5 text-slate-500">
                Start a new patient registration
              </span>
            </span>

            <Plus className="h-4 w-4 text-slate-400 transition-colors group-hover:text-teal-700" />
          </button>

          <button
            type="button"
            onClick={focusSearch}
            className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-teal-300 hover:bg-teal-50/40"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Search className="h-5 w-5" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-slate-900">
                Find Patient
              </span>

              <span className="mt-1 block text-xs leading-5 text-slate-500">
                Search the sample registration list
              </span>
            </span>

            <Search className="h-4 w-4 text-slate-400 transition-colors group-hover:text-teal-700" />
          </button>

          <button
            type="button"
            onClick={viewRecentRegistrations}
            className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-teal-300 hover:bg-teal-50/40"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
              <FileText className="h-5 w-5" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-slate-900">
                Recent Registrations
              </span>

              <span className="mt-1 block text-xs leading-5 text-slate-500">
                Review the latest sample entries
              </span>
            </span>

            <CheckCircle2 className="h-4 w-4 text-slate-400 transition-colors group-hover:text-teal-700" />
          </button>
        </div>
      </section>

      <section
        ref={tableRef}
        className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100/60"
      >
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Recent Registrations
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Latest patient entries in the demonstration dataset.
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              ref={searchRef}
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search patients..."
              aria-label="Search patient registrations"
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Patient
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Patient ID
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Registration Date
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Contact
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
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

                  <td className="px-5 py-4">
                    <p className="text-sm text-slate-700">
                      {formatDate(patient.registeredAt)}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatTime(patient.registeredAt)}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {patient.contactNumber}
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
                </tr>
              ))}

              {filteredRegistrations.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    No sample registrations match &ldquo;{search}&rdquo;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {filteredRegistrations.length} of {registrations.length}{" "}
            registration records
          </span>

          <span>Demo records only</span>
        </div>
      </section>

      <PatientRegistrationDialog
        open={isRegistrationDialogOpen}
        onOpenChange={setIsRegistrationDialogOpen}
        existingRegistrations={registrations}
        onRegister={handleRegisterPatient}
      />
    </div>
  );
}
