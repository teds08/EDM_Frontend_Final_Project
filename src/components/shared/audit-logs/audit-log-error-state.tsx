"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

interface AuditLogErrorStateProps {
  message: string;
  onRetry: () => void;
  loading?: boolean;
}

export function AuditLogErrorState({
  message,
  onRetry,
  loading = false,
}: AuditLogErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-red-200 bg-white p-8 text-center"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
        <AlertCircle className="h-6 w-6" />
      </div>

      <h3 className="text-base font-semibold text-slate-900">
        Unable to load audit logs
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        disabled={loading}
        className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        {loading ? "Retrying..." : "Try again"}
      </button>
    </div>
  );
}
