"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Copy,
  FileText,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type {
  AuditLog,
  AuditOutcome,
} from "@/types/admin-audit-logs/audit-log";

interface AuditLogDetailsDialogProps {
  log: AuditLog | null;
  onClose: () => void;
}

const outcomeStyles: Record<AuditOutcome, string> = {
  Success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Warning: "border-amber-200 bg-amber-50 text-amber-800",
  Failed: "border-rose-200 bg-rose-50 text-rose-700",
};

export function AuditLogDetailsDialog({
  log,
  onClose,
}: AuditLogDetailsDialogProps) {
  if (!log) {
    return null;
  }

  const eventId = log.id;

  async function copyEventId() {
    try {
      await navigator.clipboard.writeText(eventId);
    } catch {
      // Clipboard access may be unavailable in insecure contexts.
    }
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
        aria-labelledby="audit-log-details-title"
        className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        {/* Dialog Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <ShieldCheck size={21} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Audit event details
              </p>

              <h2
                id="audit-log-details-title"
                className="mt-1 text-lg font-semibold tracking-tight text-slate-900"
              >
                {log.action}
              </h2>

              <p className="mt-1 text-sm leading-5 text-slate-500">
                {log.resource}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close audit event details"
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={18} />
          </button>
        </div>

        {/* Dialog Content */}
        <div className="space-y-5 p-5 sm:p-6">
          {/* Outcome and Category */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={outcomeStyles[log.outcome]}>
              {log.outcome === "Success" ? (
                <CheckCircle2 size={12} className="mr-1.5" />
              ) : log.outcome === "Warning" ? (
                <AlertTriangle size={12} className="mr-1.5" />
              ) : (
                <XCircle size={12} className="mr-1.5" />
              )}

              {log.outcome}
            </Badge>

            <Badge
              variant="outline"
              className="border-slate-200 bg-white text-slate-700"
            >
              {log.category}
            </Badge>
          </div>

          {/* Event Metadata */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Event ID */}
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <FileText size={16} />
                <p className="text-xs font-medium">Event ID</p>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <p className="break-all font-mono text-sm font-semibold text-slate-800">
                  {eventId}
                </p>

                <button
                  type="button"
                  onClick={copyEventId}
                  title="Copy event ID"
                  aria-label="Copy event ID"
                  className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-teal-700"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>

            {/* Timestamp */}
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Clock size={16} />
                <p className="text-xs font-medium">Timestamp</p>
              </div>

              <p className="mt-2 text-sm font-semibold text-slate-800">
                {log.timestamp}
              </p>
            </div>

            {/* Actor */}
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <ShieldCheck size={16} />
                <p className="text-xs font-medium">Actor</p>
              </div>

              <p className="mt-2 text-sm font-semibold text-slate-800">
                {log.actor}
              </p>

              <p className="mt-1 text-xs text-slate-500">{log.role}</p>
            </div>
          </div>

          {/* Event Description */}
          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-800">
              Event description
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {log.details}
            </p>
          </div>

          {/* Related Resource */}
          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-800">
              Related resource
            </h3>

            <p className="mt-2 text-sm text-slate-600">{log.resource}</p>

            <p className="mt-1 text-xs text-slate-400">
              Reference ID: {log.resourceId}
            </p>
          </div>

          {/* Demo Notice */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs leading-5 text-amber-900">
              This is a fictional audit record for the academic demonstration.
              In the connected backend, audit records should be protected from
              unauthorized modification and deletion.
            </p>
          </div>
        </div>

        {/* Dialog Footer */}
        <div className="flex justify-end border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="h-10 cursor-pointer rounded-lg bg-teal-700 px-5 text-sm font-medium text-white transition-colors hover:bg-teal-800"
          >
            Close
          </button>
        </div>
      </section>
    </div>
  );
}
