"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Database, FileSearch, RefreshCw, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AuditLogsTable } from "@/components/admin/audit-logs/audit-logs-table";
import { AuditLogFilters } from "@/components/shared/audit-logs/audit-log-filters";
import { AuditLogPagination } from "@/components/shared/audit-logs/audit-log-pagination";
import { AuditLogEmptyState } from "@/components/shared/audit-logs/audit-log-empty-state";
import { AuditLogLoading } from "@/components/shared/audit-logs/audit-log-loading";
import { AuditLogErrorState } from "@/components/shared/audit-logs/audit-log-error-state";
import { AuditLogDetails } from "@/components/shared/audit-logs/audit-log-details";

import { getRegistrationAuditLogs } from "@/lib/api/audit.api";
import { ApiError, AUTH_ROLE_KEY, AUTH_TOKEN_KEY } from "@/lib/api";

import type {
  AuditLog,
  AuditLogPagination as AuditLogPaginationData,
  AuditLogQueryParams,
} from "@/types/admin-audit-logs/audit-log";

const PAGE_SIZE = 10;

const initialPagination: AuditLogPaginationData = {
  page: 1,
  limit: PAGE_SIZE,
  totalRecords: 0,
  totalPages: 0,
};

const initialFilters: AuditLogQueryParams = {
  page: 1,
  limit: PAGE_SIZE,
};

/**
 * Simplify action names for display in the Registration Staff table.
 * The original backend action values are not modified.
 */
function getActionLabel(action: string): string {
  const normalized = action
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

  const actionLabels: Record<string, string> = {
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
  };

  const knownLabel = actionLabels[normalized];

  if (knownLabel) {
    return knownLabel;
  }

  // Make unrecognized action values readable without changing backend data.
  return action
    .trim()
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 400) {
      return error.message || "Please check your filters and date range.";
    }

    if (error.status === 403) {
      return "You do not have permission to view these registration audit logs.";
    }

    if (error.status === 404) {
      return "The registration audit-log endpoint could not be found. Verify the backend route.";
    }

    if (error.status >= 500) {
      return "The server could not retrieve registration audit logs. Please try again.";
    }

    return "The request could not be completed. Please try again.";
  }

  if (
    error instanceof Error &&
    error.message.toLowerCase().includes("connect")
  ) {
    return "Unable to connect to the backend. Check that the server is running and the API URL is correct.";
  }

  return "Something went wrong while retrieving registration audit logs. Please try again.";
}

export function RegistrationAuditLogsView() {
  const router = useRouter();

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [pagination, setPagination] =
    useState<AuditLogPaginationData>(initialPagination);

  const [filters, setFilters] = useState<AuditLogQueryParams>(initialFilters);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // Create display-only labels for the ACTION column.
  const displayLogs = useMemo(
    () =>
      logs.map((log) => ({
        ...log,
        action: getActionLabel(log.action),
      })),
    [logs],
  );

  useEffect(() => {
    let ignoreResponse = false;

    async function loadAuditLogs() {
      setIsLoading(true);
      setPageError("");

      try {
        const response = await getRegistrationAuditLogs(filters);

        if (ignoreResponse) return;

        if (!response.success) {
          throw new Error(
            response.message || "Unable to retrieve registration audit logs.",
          );
        }

        setLogs(Array.isArray(response.data) ? response.data : []);
        setPagination(response.pagination);
      } catch (error) {
        if (ignoreResponse) return;

        if (error instanceof ApiError && error.status === 401) {
          window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
          window.sessionStorage.removeItem(AUTH_ROLE_KEY);
          router.replace("/login");
          return;
        }

        setPageError(getErrorMessage(error));
      } finally {
        if (!ignoreResponse) {
          setIsLoading(false);
        }
      }
    }

    const timeoutId = window.setTimeout(() => {
      void loadAuditLogs();
    }, 250);

    return () => {
      ignoreResponse = true;
      window.clearTimeout(timeoutId);
    };
  }, [filters, reloadKey, router]);

  function handleFiltersChange(nextFilters: AuditLogQueryParams) {
    setFilters({
      ...nextFilters,
      page: 1,
      limit: filters.limit ?? PAGE_SIZE,
    });
  }

  function handleClearFilters() {
    setFilters({
      page: 1,
      limit: filters.limit ?? PAGE_SIZE,
    });
  }

  function handlePageChange(nextPage: number) {
    const maximumPage = Math.max(1, pagination.totalPages);
    const safePage = Math.min(maximumPage, Math.max(1, nextPage));

    setFilters((current) => ({
      ...current,
      page: safePage,
    }));
  }

  function handleLimitChange(nextLimit: number) {
    const safeLimit = Math.min(Math.max(nextLimit, 1), 100);

    setFilters((current) => ({
      ...current,
      page: 1,
      limit: safeLimit,
    }));
  }

  const displayedPagination: AuditLogPaginationData = {
    ...pagination,
    page: filters.page ?? 1,
    limit: filters.limit ?? PAGE_SIZE,
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-7">
      {/* Page Heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Registration</span>
            <span className="text-slate-300">/</span>
            <span className="text-teal-700">Audit Logs</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Registration Audit Logs
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Review patient-related changes associated with your authenticated
            Registration Staff account.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => setReloadKey((current) => current + 1)}
          disabled={isLoading}
          className="cursor-pointer"
        >
          <RefreshCw
            size={15}
            className={`mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </section>

      {/* Access Notice */}
      <section className="flex items-start gap-3 rounded-xl border border-teal-200 bg-teal-50/80 p-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
          <ShieldCheck size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-teal-950">
            Personal Registration History
          </h2>

          <p className="mt-1 text-sm leading-5 text-teal-900/80">
            Audit records are retrieved from the backend. The backend determines
            which activities your account is authorized to view. This page is
            read-only.
          </p>
        </div>
      </section>

      {/* Registration Audit Trail */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Patient Record Changes
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Search registration activities, apply filters, and inspect
            individual audit events.
          </p>
        </div>

        <AuditLogFilters
          filters={filters}
          onChange={handleFiltersChange}
          onClear={handleClearFilters}
          showActorRole={false}
        />

        {pageError && (
          <AuditLogErrorState
            message={pageError}
            onRetry={() => setReloadKey((current) => current + 1)}
            loading={isLoading}
          />
        )}

        {!pageError && isLoading && logs.length === 0 && <AuditLogLoading />}

        {!pageError && !isLoading && logs.length === 0 && (
          <AuditLogEmptyState
            title="No registration changes found"
            description="No records match the selected filters. Successful registration activities will appear here when they are available from the backend."
          />
        )}

        {!pageError && logs.length > 0 && (
          <>
            {isLoading && (
              <div
                role="status"
                aria-live="polite"
                className="flex items-center gap-2 text-xs text-teal-700"
              >
                <RefreshCw size={14} className="animate-spin" />
                Refreshing registration audit records...
              </div>
            )}

            <AuditLogsTable
              logs={displayLogs}
              onView={(displayLog) => {
                // Use the original record for the read-only details dialog.
                const originalLog = logs.find(
                  (log) => log.id === displayLog.id,
                );

                setSelectedLog(originalLog ?? displayLog);
              }}
            />

            <AuditLogPagination
              pagination={displayedPagination}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              disabled={isLoading}
            />
          </>
        )}

        <p className="flex items-start gap-2 text-xs leading-5 text-slate-400">
          <FileSearch size={14} className="mt-0.5 shrink-0" />

          <span>
            Audit records cannot be created, edited, or deleted from this page.
            The backend determines actor identity and enforces access
            restrictions.
          </span>
        </p>
      </section>

      {/* Footer */}
      <footer className="flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>CareBridge · Registration Workspace</p>

        <p className="inline-flex items-center gap-1.5">
          <Database size={13} />
          Backend audit records
        </p>
      </footer>

      {/* Read-only Event Details */}
      <AuditLogDetails
        log={selectedLog}
        open={selectedLog !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedLog(null);
          }
        }}
      />
    </div>
  );
}
