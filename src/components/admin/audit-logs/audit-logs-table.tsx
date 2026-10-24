"use client";

import { CheckCircle2, Eye, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type {
  AuditActorRole,
  AuditLog,
} from "@/types/admin-audit-logs/audit-log";

interface AuditLogsTableProps {
  logs: AuditLog[];
  onView: (log: AuditLog) => void;
}

const roleLabels: Record<AuditActorRole, string> = {
  ADMIN: "Administrator",
  REGISTRATION: "Registration Staff",
  LABORATORY: "Laboratory Staff",
  BILLING: "Billing Staff",
};

const roleStyles: Record<AuditActorRole, string> = {
  ADMIN: "border-violet-200 bg-violet-50 text-violet-700",
  REGISTRATION: "border-blue-200 bg-blue-50 text-blue-700",
  LABORATORY: "border-teal-200 bg-teal-50 text-teal-700",
  BILLING: "border-amber-200 bg-amber-50 text-amber-700",
};

/**
 * Simplifies action names for display only.
 * The original audit record remains unchanged.
 */
function getActionLabel(action: string): string {
  const normalized = action
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

  const actionLabels: Record<string, string> = {
    // Patient records
    PATIENT_CREATED: "Register Patient",
    PATIENT_REGISTERED: "Register Patient",
    REGISTER_PATIENT: "Register Patient",
    CREATE_PATIENT: "Register Patient",
    CREATE_PATIENT_RECORD: "Register Patient",

    PATIENT_UPDATED: "Update Patient",
    UPDATE_PATIENT: "Update Patient",
    UPDATE_PATIENT_RECORD: "Update Patient",

    PATIENT_STATUS_UPDATED: "Update Status",
    UPDATE_PATIENT_STATUS: "Update Status",

    PATIENT_DELETED: "Delete Patient",
    DELETE_PATIENT: "Delete Patient",
    DELETE_PATIENT_RECORD: "Delete Patient",

    // User management
    USER_CREATED: "Create User",
    USER_REGISTERED: "Create User",
    CREATE_USER: "Create User",
    USER_UPDATED: "Update User",
    UPDATE_USER: "Update User",
    USER_DELETED: "Delete User",
    DELETE_USER: "Delete User",
    USER_ARCHIVED: "Archive User",
    ARCHIVE_USER: "Archive User",
    USER_RESTORED: "Restore User",
    RESTORE_USER: "Restore User",

    // Service management
    SERVICE_CREATED: "Create Service",
    CREATE_SERVICE: "Create Service",
    SERVICE_UPDATED: "Update Service",
    UPDATE_SERVICE: "Update Service",
    SERVICE_DELETED: "Delete Service",
    DELETE_SERVICE: "Delete Service",
    SERVICE_ARCHIVED: "Archive Service",
    ARCHIVE_SERVICE: "Archive Service",
    SERVICE_RESTORED: "Restore Service",
    RESTORE_SERVICE: "Restore Service",

    // Appointment management
    APPOINTMENT_CREATED: "Create Appointment",
    CREATE_APPOINTMENT: "Create Appointment",
    APPOINTMENT_UPDATED: "Update Appointment",
    UPDATE_APPOINTMENT: "Update Appointment",
    APPOINTMENT_CANCELLED: "Cancel Appointment",
    CANCEL_APPOINTMENT: "Cancel Appointment",
    APPOINTMENT_DELETED: "Delete Appointment",
    DELETE_APPOINTMENT: "Delete Appointment",
    APPOINTMENT_STATUS_UPDATED: "Update Appointment Status",
    UPDATE_APPOINTMENT_STATUS: "Update Appointment Status",

    // Laboratory
    LAB_RESULT_CREATED: "Add Lab Result",
    CREATE_LAB_RESULT: "Add Lab Result",
    LAB_RESULT_UPDATED: "Update Lab Result",
    UPDATE_LAB_RESULT: "Update Lab Result",
    LAB_RESULT_DELETED: "Delete Lab Result",
    DELETE_LAB_RESULT: "Delete Lab Result",

    // Billing
    PAYMENT_CREATED: "Record Payment",
    CREATE_PAYMENT: "Record Payment",
    PAYMENT_UPDATED: "Update Payment",
    UPDATE_PAYMENT: "Update Payment",
    PAYMENT_DELETED: "Delete Payment",
    DELETE_PAYMENT: "Delete Payment",
    INVOICE_CREATED: "Create Invoice",
    CREATE_INVOICE: "Create Invoice",
    INVOICE_UPDATED: "Update Invoice",
    UPDATE_INVOICE: "Update Invoice",
  };

  const knownLabel = actionLabels[normalized];

  if (knownLabel) {
    return knownLabel;
  }

  // Handle action values that are already human-readable.
  if (!/[_-]/.test(action.trim())) {
    return action.trim() || "Unknown Action";
  }

  // Fallback for actions that have not been mapped yet.
  return action
    .trim()
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatTimestamp(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value || "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function AuditLogsTable({ logs, onView }: AuditLogsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/30">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1300px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="whitespace-nowrap px-4 py-3.5 text-xs font-semibold text-slate-500">
                Audit ID
              </th>

              <th className="px-4 py-3.5 text-xs font-semibold text-slate-500">
                Actor
              </th>

              <th className="px-4 py-3.5 text-xs font-semibold text-slate-500">
                Action
              </th>

              <th className="px-4 py-3.5 text-xs font-semibold text-slate-500">
                Resource Type
              </th>

              <th className="px-4 py-3.5 text-xs font-semibold text-slate-500">
                Reference ID
              </th>

              <th className="px-4 py-3.5 text-xs font-semibold text-slate-500">
                Outcome
              </th>

              <th className="px-4 py-3.5 text-xs font-semibold text-slate-500">
                Details
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-xs font-semibold text-slate-500">
                Date &amp; Time
              </th>

              <th className="px-4 py-3.5 text-right text-xs font-semibold text-slate-500">
                View
              </th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/70"
              >
                {/* Database audit ID */}
                <td className="whitespace-nowrap px-4 py-4">
                  <span className="font-mono text-xs font-semibold text-slate-600">
                    {log.id}
                  </span>
                </td>

                {/* Actor */}
                <td className="px-4 py-4">
                  <div className="min-w-[150px]">
                    <p className="font-medium text-slate-800">
                      {log.actorName}
                    </p>

                    <div className="mt-1.5">
                      <Badge
                        variant="outline"
                        className={
                          roleStyles[log.actorRole] ??
                          "border-slate-200 bg-slate-50 text-slate-600"
                        }
                      >
                        {roleLabels[log.actorRole] ?? log.actorRole}
                      </Badge>
                    </div>
                  </div>
                </td>

                {/* Simplified Action */}
                <td className="px-4 py-4">
                  <p className="min-w-[150px] font-semibold leading-5 text-slate-800">
                    {getActionLabel(log.action)}
                  </p>
                </td>

                {/* Resource Type */}
                <td className="whitespace-nowrap px-4 py-4">
                  <span className="text-slate-600">{log.resourceType}</span>
                </td>

                {/* Actual database resource ID */}
                <td className="whitespace-nowrap px-4 py-4">
                  <span className="font-mono text-xs font-medium text-slate-600">
                    {log.resourceId}
                  </span>
                </td>

                {/* Outcome */}
                <td className="whitespace-nowrap px-4 py-4">
                  <Badge
                    variant="outline"
                    className="border-emerald-200 bg-emerald-50 text-emerald-700"
                  >
                    <CheckCircle2 size={12} className="mr-1.5" />
                    Success
                  </Badge>
                </td>

                {/* Details */}
                <td className="px-4 py-4">
                  <p
                    title={log.details}
                    className="max-w-[240px] truncate text-xs leading-5 text-slate-500"
                  >
                    {log.details || "No details provided"}
                  </p>
                </td>

                {/* Timestamp */}
                <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-600">
                  {formatTimestamp(log.createdAt)}
                </td>

                {/* View Details: pass the original audit record */}
                <td className="px-4 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onView(log)}
                    aria-label={`View audit event ${log.id}`}
                    title="View event details"
                    className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}

            {logs.length === 0 && (
              <tr>
                <td colSpan={9} className="px-5 py-14 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <FileText size={27} className="text-slate-300" />

                    <p className="text-sm font-semibold text-slate-700">
                      No audit events found
                    </p>

                    <p className="max-w-sm text-xs leading-5 text-slate-500">
                      No records match the current search or filters. Try
                      adjusting your search criteria.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          Showing {logs.length} event{logs.length === 1 ? "" : "s"}
        </p>

        <p className="text-xs text-slate-400">Audit records are read-only.</p>
      </div>
    </div>
  );
}
