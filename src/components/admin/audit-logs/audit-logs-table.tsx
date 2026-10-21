"use client";

import { AlertTriangle, CheckCircle2, Eye, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type {
  AuditLog,
  AuditOutcome,
} from "@/types/admin-audit-logs/audit-log";

interface AuditLogsTableProps {
  logs: AuditLog[];
  onView: (log: AuditLog) => void;
}

const outcomeStyles: Record<AuditOutcome, string> = {
  Success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Warning: "border-amber-200 bg-amber-50 text-amber-800",
  Failed: "border-rose-200 bg-rose-50 text-rose-700",
};

export function AuditLogsTable({ logs, onView }: AuditLogsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/30">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-5 py-3.5 text-xs font-semibold text-slate-500">
                Event
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold text-slate-500">
                User / Actor
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold text-slate-500">
                Category
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold text-slate-500">
                Outcome
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold text-slate-500">
                Timestamp
              </th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500">
                Details
              </th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/70"
              >
                <td className="px-5 py-4">
                  <div className="min-w-[210px]">
                    <p className="font-semibold leading-5 text-slate-800">
                      {log.action}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {log.resource}
                    </p>

                    <p className="mt-1.5 text-[11px] font-medium text-slate-400">
                      {log.id}
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <p className="whitespace-nowrap font-medium text-slate-800">
                    {log.actor}
                  </p>

                  <p className="mt-1 whitespace-nowrap text-xs text-slate-500">
                    {log.role}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <Badge
                    variant="outline"
                    className="border-slate-200 bg-white text-slate-700"
                  >
                    {log.category}
                  </Badge>
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  <Badge
                    variant="outline"
                    className={outcomeStyles[log.outcome]}
                  >
                    {log.outcome === "Success" ? (
                      <CheckCircle2 size={12} className="mr-1.5" />
                    ) : log.outcome === "Warning" ? (
                      <AlertTriangle size={12} className="mr-1.5" />
                    ) : (
                      <XCircle size={12} className="mr-1.5" />
                    )}

                    {log.outcome}
                  </Badge>
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-600">
                  {log.timestamp}
                </td>

                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onView(log)}
                    aria-label={`View details for ${log.id}`}
                    title="View event details"
                    className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}

            {logs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-14 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Eye size={27} className="text-slate-300" />

                    <p className="text-sm font-semibold text-slate-700">
                      No audit events found
                    </p>

                    <p className="max-w-sm text-xs leading-5 text-slate-500">
                      Try a different search term or adjust the selected
                      filters.
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

        <p className="text-xs text-slate-400">Sample events are read-only.</p>
      </div>
    </div>
  );
}
