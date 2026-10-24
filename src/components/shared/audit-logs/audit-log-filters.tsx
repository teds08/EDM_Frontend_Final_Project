"use client";

import type { AuditLogQueryParams } from "@/types/admin-audit-logs/audit-log";

interface AuditLogFiltersProps {
  filters: AuditLogQueryParams;
  onChange: (filters: AuditLogQueryParams) => void;
  onClear: () => void;
  showActorRole?: boolean;
}

function toDateInputValue(value?: string): string {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function toIsoDate(value: string, endOfDay = false): string | undefined {
  if (!value) return undefined;

  const [year, month, day] = value.split("-").map(Number);

  const date = new Date(
    year,
    month - 1,
    day,
    endOfDay ? 23 : 0,
    endOfDay ? 59 : 0,
    endOfDay ? 59 : 0,
    endOfDay ? 999 : 0,
  );

  return date.toISOString();
}

export function AuditLogFilters({
  filters,
  onChange,
  onClear,
  showActorRole = true,
}: AuditLogFiltersProps) {
  const updateFilter = (
    key: keyof AuditLogQueryParams,
    value: string | number | undefined,
  ) => {
    onChange({
      ...filters,
      [key]: value === "" ? undefined : value,
      page: 1,
    });
  };

  const inputClassName =
    "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10";

  const labelClassName = "text-xs font-semibold text-slate-600";

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.action ||
    filters.resourceType ||
    filters.actorRole ||
    filters.outcome ||
    filters.startDate ||
    filters.endDate,
  );

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Filter audit logs
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Filters are applied by the backend.
          </p>
        </div>

        <button
          type="button"
          onClick={onClear}
          disabled={!hasActiveFilters}
          className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear filters
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div>
          <label htmlFor="audit-search" className={labelClassName}>
            Search
          </label>
          <input
            id="audit-search"
            type="search"
            value={filters.search ?? ""}
            onChange={(event) => updateFilter("search", event.target.value)}
            placeholder="Search activity or actor..."
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="audit-action" className={labelClassName}>
            Action
          </label>
          <input
            id="audit-action"
            type="text"
            value={filters.action ?? ""}
            onChange={(event) => updateFilter("action", event.target.value)}
            placeholder="e.g. PATIENT_CREATED"
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="audit-resource-type" className={labelClassName}>
            Resource type
          </label>
          <input
            id="audit-resource-type"
            type="text"
            value={filters.resourceType ?? ""}
            onChange={(event) =>
              updateFilter("resourceType", event.target.value)
            }
            placeholder="e.g. Patient"
            className={inputClassName}
          />
        </div>

        {showActorRole && (
          <div>
            <label htmlFor="audit-actor-role" className={labelClassName}>
              Actor role
            </label>
            <select
              id="audit-actor-role"
              value={filters.actorRole ?? ""}
              onChange={(event) =>
                updateFilter("actorRole", event.target.value || undefined)
              }
              className={inputClassName}
            >
              <option value="">All roles</option>
              <option value="ADMIN">Admin</option>
              <option value="REGISTRATION">Registration Staff</option>
              <option value="LABORATORY">Laboratory Staff</option>
              <option value="BILLING">Billing Staff</option>
            </select>
          </div>
        )}

        <div>
          <label htmlFor="audit-outcome" className={labelClassName}>
            Outcome
          </label>
          <select
            id="audit-outcome"
            value={filters.outcome ?? ""}
            onChange={(event) =>
              updateFilter("outcome", event.target.value || undefined)
            }
            className={inputClassName}
          >
            <option value="">All outcomes</option>
            <option value="SUCCESS">Success</option>
          </select>
        </div>

        <div>
          <label htmlFor="audit-start-date" className={labelClassName}>
            Start date
          </label>
          <input
            id="audit-start-date"
            type="date"
            value={toDateInputValue(filters.startDate)}
            onChange={(event) =>
              updateFilter("startDate", toIsoDate(event.target.value))
            }
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="audit-end-date" className={labelClassName}>
            End date
          </label>
          <input
            id="audit-end-date"
            type="date"
            min={toDateInputValue(filters.startDate)}
            value={toDateInputValue(filters.endDate)}
            onChange={(event) =>
              updateFilter("endDate", toIsoDate(event.target.value, true))
            }
            className={inputClassName}
          />
        </div>
      </div>
    </section>
  );
}
