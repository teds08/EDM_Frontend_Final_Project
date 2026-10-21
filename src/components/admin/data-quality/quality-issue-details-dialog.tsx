"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Database,
  RotateCcw,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type {
  QualityIssue,
  QualitySeverity,
  QualityStatus,
} from "@/types/admin-data-quality/quality-issue";

interface QualityIssueDetailsDialogProps {
  issue: QualityIssue | null;
  onClose: () => void;
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
  if (status === "Open") return "Start review";
  if (status === "In Review") return "Mark as resolved";
  return "Reopen issue";
}

export function QualityIssueDetailsDialog({
  issue,
  onClose,
  onAdvanceStatus,
}: QualityIssueDetailsDialogProps) {
  if (!issue) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="quality-issue-dialog-title"
        className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <ClipboardCheck size={21} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                {issue.id} · Data quality issue
              </p>

              <h2
                id="quality-issue-dialog-title"
                className="mt-1 text-lg font-semibold tracking-tight text-slate-900"
              >
                {issue.title}
              </h2>

              <p className="mt-1 text-sm leading-5 text-slate-500">
                {issue.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close issue details"
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={severityStyles[issue.severity]}>
              {issue.severity} severity
            </Badge>

            <Badge variant="outline" className={statusStyles[issue.status]}>
              {issue.status}
            </Badge>

            <Badge
              variant="outline"
              className="border-slate-200 bg-white text-slate-700"
            >
              {issue.category}
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Database size={16} />
                <p className="text-xs font-medium">Source system</p>
              </div>

              <p className="mt-2 text-sm font-semibold text-slate-800">
                {issue.source}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <AlertTriangle size={16} />
                <p className="text-xs font-medium">Affected records</p>
              </div>

              <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900">
                {issue.affectedRecords.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-800">
              Issue description
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {issue.details}
            </p>

            <p className="mt-3 text-xs text-slate-400">
              Detected: {issue.detectedAt}
            </p>
          </div>

          <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-4">
            <h3 className="text-sm font-semibold text-teal-950">
              Recommended action
            </h3>

            <p className="mt-2 text-sm leading-6 text-teal-900/80">
              {issue.suggestedAction}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-800">
              Sample record references
            </h3>

            <div className="mt-3 flex flex-wrap gap-2">
              {issue.sampleRecordIds.map((recordId) => (
                <span
                  key={recordId}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono text-xs text-slate-600"
                >
                  {recordId}
                </span>
              ))}
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-400">
              Fictional identifiers for interface demonstration. They do not
              link to actual patient or clinical records.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs text-slate-400">
            Status changes are temporary and not saved to a backend.
          </p>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 cursor-pointer rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => onAdvanceStatus(issue)}
              className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-medium text-white transition-colors hover:bg-teal-800"
            >
              {issue.status === "Resolved" ? (
                <RotateCcw size={15} />
              ) : (
                <CheckCircle2 size={15} />
              )}

              {getActionLabel(issue.status)}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
