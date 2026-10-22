"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  Plus,
  RefreshCw,
  UserPlus,
  Users,
} from "lucide-react";

import { PatientRegistrationDialog } from "@/components/registration/patients/patient-registration-dialog";
import { useRegistration } from "@/components/registration/registration-provider";
import type {
  PatientRegistration,
  RegistrationStatus,
} from "@/types/registration-dashboard/registration";

const STATUS_STYLES: Record<RegistrationStatus, string> = {
  Complete: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Pending Review": "bg-amber-50 text-amber-700 border-amber-200",
  Incomplete: "bg-rose-50 text-rose-700 border-rose-200",
};

function formatDate(value?: string) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getInitials(fullName?: string) {
  if (!fullName?.trim()) return "PT";

  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconStyle,
}: {
  title: string;
  value: number;
  description: string;
  icon: typeof Users;
  iconStyle: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            {value.toLocaleString()}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${iconStyle}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">{description}</p>
    </div>
  );
}

export function RegistrationDashboardView() {
  const router = useRouter();
  const { registrations, registerPatient } = useRegistration();

  const [isRegistrationDialogOpen, setIsRegistrationDialogOpen] =
    useState(false);
  const [notice, setNotice] = useState("");

  const stats = useMemo(() => {
    const totalPatients = registrations.length;
    const completeRecords = registrations.filter(
      (patient) => patient.status === "Complete",
    ).length;
    const pendingReview = registrations.filter(
      (patient) => patient.status === "Pending Review",
    ).length;
    const incompleteRecords = registrations.filter(
      (patient) => patient.status === "Incomplete",
    ).length;

    const completionRate =
      totalPatients > 0
        ? Math.round((completeRecords / totalPatients) * 100)
        : 0;

    return {
      totalPatients,
      completeRecords,
      pendingReview,
      incompleteRecords,
      completionRate,
    };
  }, [registrations]);

  const latestRegistrations = useMemo(() => {
    return [...registrations]
      .sort((a, b) => {
        const dateA = new Date(a.registeredAt ?? 0).getTime();
        const dateB = new Date(b.registeredAt ?? 0).getTime();

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [registrations]);

  const handleRegisterPatient = (patient: PatientRegistration) => {
    registerPatient(patient);
    setNotice("Patient registration completed successfully.");
  };

  const handleOpenRegistration = () => {
    setNotice("");
    setIsRegistrationDialogOpen(true);
  };

  const getStatusIcon = (status: RegistrationStatus) => {
    switch (status) {
      case "Complete":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case "Pending Review":
        return <Clock3 className="h-4 w-4 text-amber-600" />;
      case "Incomplete":
        return <AlertCircle className="h-4 w-4 text-rose-600" />;
    }
  };

  const getStatusBarColor = (status: RegistrationStatus) => {
    switch (status) {
      case "Complete":
        return "bg-emerald-500";
      case "Pending Review":
        return "bg-amber-500";
      case "Incomplete":
        return "bg-rose-500";
    }
  };

  const statusBreakdown: {
    label: RegistrationStatus;
    count: number;
  }[] = [
    { label: "Complete", count: stats.completeRecords },
    { label: "Pending Review", count: stats.pendingReview },
    { label: "Incomplete", count: stats.incompleteRecords },
  ];

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <Activity className="h-5 w-5" />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Registration Dashboard
            </h1>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Monitor patient registration and record completeness.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.refresh()}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Demo notice */}
      <div className="flex items-start gap-3 rounded-xl border border-teal-200 bg-teal-50/70 p-4">
        <div className="mt-0.5 text-teal-700">
          <FileText className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm font-semibold text-teal-900">
            Registration overview
          </p>
          <p className="mt-1 text-sm leading-6 text-teal-800">
            Use this dashboard to monitor record status and identify records
            that need attention. Patient information and record management are
            available in the Patient Registry.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          description="All registered patient records"
          icon={Users}
          iconStyle="bg-slate-100 text-slate-700"
        />

        <StatCard
          title="Complete Records"
          value={stats.completeRecords}
          description="Records marked as complete"
          icon={CheckCircle2}
          iconStyle="bg-emerald-50 text-emerald-700"
        />

        <StatCard
          title="Pending Review"
          value={stats.pendingReview}
          description="Records awaiting staff review"
          icon={Clock3}
          iconStyle="bg-amber-50 text-amber-700"
        />

        <StatCard
          title="Incomplete Records"
          value={stats.incompleteRecords}
          description="Records that may need information"
          icon={AlertCircle}
          iconStyle="bg-rose-50 text-rose-700"
        />
      </div>

      {/* Main dashboard sections */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* Record completeness */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Record Completeness
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Overview of patient documentation status.
              </p>
            </div>

            <div className="rounded-lg bg-teal-50 p-2 text-teal-700">
              <ClipboardCheck className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-7">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Complete records</p>
                <p className="mt-1 text-3xl font-semibold text-slate-900">
                  {stats.completionRate}%
                </p>
              </div>

              <p className="text-sm text-slate-500">
                {stats.completeRecords} of {stats.totalPatients} records
              </p>
            </div>

            <div
              className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-label="Complete patient records"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={stats.completionRate}
            >
              <div
                className="h-full rounded-full bg-teal-600 transition-all duration-300"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-500">
              This percentage is based on the number of records currently marked
              as Complete.
            </p>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6">
            <h3 className="text-sm font-semibold text-slate-800">
              Status Breakdown
            </h3>

            <div className="mt-4 space-y-5">
              {statusBreakdown.map(({ label, count }) => {
                const percentage =
                  stats.totalPatients > 0
                    ? Math.round((count / stats.totalPatients) * 100)
                    : 0;

                return (
                  <div key={label}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(label)}
                        <span className="text-sm font-medium text-slate-700">
                          {label}
                        </span>
                      </div>

                      <span className="text-sm font-semibold text-slate-900">
                        {count}
                        <span className="ml-1 font-normal text-slate-400">
                          ({percentage}%)
                        </span>
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${getStatusBarColor(label)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <h2 className="text-base font-semibold text-slate-900">
            Quick Actions
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Common registration tasks.
          </p>

          <div className="mt-5 space-y-3">
            <button
              type="button"
              onClick={handleOpenRegistration}
              className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-teal-300 hover:bg-teal-50/50"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white">
                <UserPlus className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  Register Patient
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Create a new patient record
                </p>
              </div>

              <Plus className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-teal-700" />
            </button>

            <button
              type="button"
              onClick={() => router.push("/registration/patients")}
              className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-teal-300 hover:bg-teal-50/50"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition group-hover:bg-teal-100 group-hover:text-teal-700">
                <Users className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  Patient Registry
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Search and manage patient records
                </p>
              </div>

              <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-teal-700" />
            </button>
          </div>

          <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-800">
              Records needing attention
            </p>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-slate-500">Pending review</span>
              <span className="text-sm font-semibold text-amber-700">
                {stats.pendingReview}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-slate-500">Incomplete</span>
              <span className="text-sm font-semibold text-rose-700">
                {stats.incompleteRecords}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Latest registrations, not a duplicate patient table */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Latest Registrations
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              The five most recently registered patient records.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/registration/patients")}
            className="inline-flex cursor-pointer items-center gap-2 self-start rounded-lg px-3 py-2 text-sm font-medium text-teal-700 transition hover:bg-teal-50 sm:self-auto"
          >
            View Patient Registry
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {latestRegistrations.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {latestRegistrations.map((patient) => (
              <div
                key={patient.id ?? patient.patientId}
                className="flex flex-col gap-3 px-5 py-4 transition hover:bg-slate-50/70 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-sm font-semibold text-teal-700">
                    {getInitials(patient.fullName)}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {patient.fullName}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      ID: {patient.patientId}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[patient.status]}`}
                  >
                    {patient.status}
                  </span>

                  <span className="text-xs text-slate-500 sm:min-w-28 sm:text-right">
                    {formatDate(patient.registeredAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Users className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-900">
              No registrations yet
            </h3>

            <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
              Newly registered patients will appear here. Start by creating a
              patient record.
            </p>

            <button
              type="button"
              onClick={handleOpenRegistration}
              className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
            >
              <Plus className="h-4 w-4" />
              Register Patient
            </button>
          </div>
        )}
      </section>

      {notice && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {notice}
        </div>
      )}

      <PatientRegistrationDialog
        open={isRegistrationDialogOpen}
        onOpenChange={setIsRegistrationDialogOpen}
        existingRegistrations={registrations}
        onRegister={handleRegisterPatient}
      />
    </div>
  );
}
