"use client";

import { useEffect, useState } from "react";
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

import { getAdminAuditLogs } from "@/lib/api/audit.api";
import { ApiError, AUTH_ROLE_KEY, AUTH_TOKEN_KEY } from "@/lib/api";

import type {
  AuditLog,
  AuditLogListResponse,
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

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 400) {
      return error.message || "Please check your filters and date range.";
    }

    if (error.status === 403) {
      return "You do not have permission to view system-wide audit logs.";
    }

    if (error.status >= 500) {
      return "The server could not retrieve audit logs. Please try again.";
    }

    if (error.status === 404) {
      return "The audit-log endpoint could not be found. Verify the backend route.";
    }

    return "The request could not be completed. Please try again.";
  }

  if (
    error instanceof Error &&
    error.message.toLowerCase().includes("connect")
  ) {
    return "Unable to connect to the backend. Check that the server is running and the API URL is correct.";
  }

  return "Something went wrong while retrieving audit logs. Please try again.";
}

export default function AuditLogsView() {
  const router = useRouter();

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [pagination, setPagination] =
    useState<AuditLogPaginationData>(initialPagination);

  const [filters, setFilters] = useState<AuditLogQueryParams>(initialFilters);

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignoreResponse = false;

    async function loadAuditLogs() {
      setIsLoading(true);
      setPageError("");

      try {
        const response: AuditLogListResponse = await getAdminAuditLogs(filters);

        if (ignoreResponse) {
          return;
        }

        if (!response.success) {
          throw new Error(response.message || "Unable to retrieve audit logs.");
        }

        setLogs(Array.isArray(response.data) ? response.data : []);
        setPagination(response.pagination);
      } catch (error) {
        if (ignoreResponse) {
          return;
        }

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

  function handlePageChange(page: number) {
    const maxPage = Math.max(1, pagination.totalPages);
    const safePage = Math.min(Math.max(page, 1), maxPage);

    setFilters((current) => ({
      ...current,
      page: safePage,
    }));
  }

  function handleLimitChange(limit: number) {
    const safeLimit = Math.min(Math.max(limit, 1), 100);

    setFilters((current) => ({
      ...current,
      page: 1,
      limit: safeLimit,
    }));
  }

  const currentPage = filters.page ?? 1;
  const currentLimit = filters.limit ?? PAGE_SIZE;

  const displayedPagination: AuditLogPaginationData = {
    ...pagination,
    page: currentPage,
    limit: currentLimit,
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-7">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Administration</span>
            <span className="text-slate-300">/</span>
            <span className="text-teal-700">Audit Logs</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Audit Logs
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Review important changes to patient records, user accounts,
            laboratory results, and invoices across CareBridge.
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

      <section className="flex items-start gap-3 rounded-xl border border-teal-200 bg-teal-50/80 p-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
          <ShieldCheck size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-teal-950">
            Centralized Audit Trail
          </h2>

          <p className="mt-1 text-sm leading-5 text-teal-900/80">
            Audit records are retrieved directly from the backend. This page is
            read-only and does not create, modify, or delete audit events.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Audit Trail
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Search recorded changes, filter results, and inspect individual
            audit events.
          </p>
        </div>

        <AuditLogFilters
          filters={filters}
          onChange={handleFiltersChange}
          onClear={handleClearFilters}
          showActorRole
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
            title="No audit logs found"
            description="No records match the selected filters. Try changing your search criteria or date range."
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
                Refreshing audit records...
              </div>
            )}

            <AuditLogsTable logs={logs} onView={(log) => setSelectedLog(log)} />

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
            Audit records are read-only. The backend is responsible for
            recording successful changes, validating requests, enforcing role
            permissions, and protecting audit history.
          </span>
        </p>
      </section>

      <footer className="flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>CareBridge · Healthcare Data Integration</p>

        <p className="inline-flex items-center gap-1.5">
          <Database size={13} />
          Backend audit records
        </p>
      </footer>

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
