import { LoaderCircle } from "lucide-react";

export function AuditLogLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8"
    >
      <LoaderCircle className="mb-3 h-7 w-7 animate-spin text-teal-600" />

      <p className="text-sm font-medium text-slate-800">
        Loading audit logs...
      </p>

      <p className="mt-1 text-xs text-slate-500">
        Retrieving records from the backend.
      </p>
    </div>
  );
}
