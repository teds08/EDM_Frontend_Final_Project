"use client";

import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  RotateCcw,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type {
  QualityIssue,
  QualitySeverity,
  QualityStatus,
} from "@/types/admin-data-quality/quality-issue";

interface QualityIssuesTableProps {
  issues: QualityIssue[];
  onView: (issue: QualityIssue) => void;
  onAdvanceStatus: (issue: QualityIssue) => void;
}

const severityStyles: Record<QualitySeverity, string> = {
  Critical: "border-rose-200 bg-rose-50 text-rose-700",
  High: "border-amber-200 bg-amber-50 text-amber-800",
  Medium: "border-blue-200 bg-blue-50 text-blue-700",
  Low: "border-slate-200 bg-slate-50 text-slate-600",
};

const statusStyles: Record<QualityStatus, string> = {
  Open: "border-rose-200 bg-rose-50 text-rose-700",
  "In Review": "border-amber-200 bg-amber-50 text-amber-800",
  Resolved: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

function getActionLabel(status: QualityStatus) {
  if (status === "Open") return "Review";
  if (status === "In Review") return "Resolve";
  return "Reopen";
}

export function QualityIssuesTable({
  issues,
  onView,
  onAdvanceStatus,
}: QualityIssuesTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/30">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-5 py-3.5 text-xs font-semibold text-slate-500">
                Issue
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold text-slate-500">
                Source
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold text-slate-500">
                Severity
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold text-slate-500">
                Affected Records
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold text-slate-500">
                Status
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold text-slate-500">
                Detected
              </th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {issues.map((issue) => {
              const actionLabel = getActionLabel(issue.status);

              return (
                <tr
                  key={issue.id}
                  className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/70"
                >
                  <td className="px-5 py-4">
                    <div className="flex min-w-[230px] items-start gap-3">
                      <div
                        className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg ${
                          issue.severity === "Critical"
                            ? "bg-rose-50 text-rose-700"
                            : issue.severity === "High"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <ClipboardCheck size={17} />
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold leading-5 text-slate-800">
                          {issue.title}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {issue.description}
                        </p>

                        <p className="mt-1.5 text-[11px] font-medium text-slate-400">
                          {issue.id} · {issue.category}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <Badge
                      variant="outline"
                      className="border-slate-200 bg-white text-slate-700"
                    >
                      {issue.source}
                    </Badge>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <Badge
                      variant="outline"
                      className={severityStyles[issue.severity]}
                    >
                      {issue.severity}
                    </Badge>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <p className="font-semibold tabular-nums text-slate-800">
                      {issue.affectedRecords.toLocaleString()}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Sample records
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <Badge
                      variant="outline"
                      className={statusStyles[issue.status]}
                    >
                      {issue.status}
                    </Badge>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-600">
                    {issue.detectedAt}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onView(issue)}
                        aria-label={`View details for ${issue.id}`}
                        title="View issue details"
                        className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onAdvanceStatus(issue)}
                        className={`inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors ${
                          issue.status === "Resolved"
                            ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                            : "bg-teal-700 text-white hover:bg-teal-800"
                        }`}
                      >
                        {issue.status === "Open" ? (
                          <ArrowRight size={14} />
                        ) : issue.status === "In Review" ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <RotateCcw size={14} />
                        )}

                        {actionLabel}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {issues.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-14 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <ClipboardCheck size={27} className="text-slate-300" />

                    <p className="text-sm font-semibold text-slate-700">
                      No quality issues found
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
          Showing {issues.length} issue{issues.length === 1 ? "" : "s"}
        </p>

        <p className="text-xs text-slate-400">
          Issue data and status changes are stored in frontend state only.
        </p>
      </div>
    </div>
  );
}
