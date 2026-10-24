import { ClipboardList } from "lucide-react";

interface AuditLogEmptyStateProps {
  title?: string;
  description?: string;
}

export function AuditLogEmptyState({
  title = "No audit logs found",
  description = "No records match the selected filters.",
}: AuditLogEmptyStateProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <ClipboardList className="h-6 w-6" />
      </div>

      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}
