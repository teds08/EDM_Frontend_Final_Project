"use client";

import type { AuditLogPagination as AuditLogPaginationData } from "@/types/admin-audit-logs/audit-log";

interface AuditLogPaginationProps {
  pagination: AuditLogPaginationData;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  disabled?: boolean;
}

export function AuditLogPagination({
  pagination,
  onPageChange,
  onLimitChange,
  disabled = false,
}: AuditLogPaginationProps) {
  const { page, limit, totalRecords, totalPages } = pagination;

  const startRecord = totalRecords === 0 ? 0 : (page - 1) * limit + 1;

  const endRecord = Math.min(page * limit, totalRecords);

  const buttonClass =
    "cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-slate-500">
        Showing{" "}
        <span className="font-semibold text-slate-800">
          {startRecord}–{endRecord}
        </span>{" "}
        of <span className="font-semibold text-slate-800">{totalRecords}</span>{" "}
        records
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          Rows
          <select
            value={limit}
            disabled={disabled}
            onChange={(event) =>
              onLimitChange(Math.min(Number(event.target.value), 100))
            }
            className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm outline-none focus:border-teal-500 disabled:cursor-not-allowed"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </label>

        <button
          type="button"
          className={buttonClass}
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>

        <span className="min-w-20 text-center text-sm text-slate-600">
          Page {page} of {Math.max(totalPages, 1)}
        </span>

        <button
          type="button"
          className={buttonClass}
          disabled={disabled || totalPages === 0 || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
