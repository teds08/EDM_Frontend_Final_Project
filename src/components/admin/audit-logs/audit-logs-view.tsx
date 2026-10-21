"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Database, FileSearch, Search } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { AuditLogStats } from "@/components/admin/audit-logs/audit-log-stats";
import { AuditLogsTable } from "@/components/admin/audit-logs/audit-logs-table";
import { AuditLogDetailsDialog } from "@/components/admin/audit-logs/audit-log-details-dialog";

import { initialAuditLogs } from "@/data/admin-audit-logs/dummy-data";

import type {
  AuditCategory,
  AuditLog,
  AuditOutcome,
} from "@/types/admin-audit-logs/audit-log";

type CategoryFilter = "All" | AuditCategory;
type OutcomeFilter = "All" | AuditOutcome;

const categories: AuditCategory[] = [
  "Authentication",
  "User Management",
  "Integration",
  "Data Quality",
  "System",
];

export default function AuditLogsView() {
  const [logs] = useState<AuditLog[]>(initialAuditLogs);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [outcomeFilter, setOutcomeFilter] = useState<OutcomeFilter>("All");

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return logs.filter((log) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        [
          log.id,
          log.actor,
          log.role,
          log.action,
          log.category,
          log.outcome,
          log.resource,
          log.resourceId,
          log.details,
          log.ipAddress,
        ].some((value) => value.toLowerCase().includes(normalizedQuery));

      const matchesCategory =
        categoryFilter === "All" || log.category === categoryFilter;

      const matchesOutcome =
        outcomeFilter === "All" || log.outcome === outcomeFilter;

      return matchesSearch && matchesCategory && matchesOutcome;
    });
  }, [logs, searchQuery, categoryFilter, outcomeFilter]);

  const successfulCount = logs.filter(
    (log) => log.outcome === "Success",
  ).length;

  const warningsCount = logs.filter((log) => log.outcome === "Warning").length;

  const failedCount = logs.filter((log) => log.outcome === "Failed").length;

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    categoryFilter !== "All" ||
    outcomeFilter !== "All";

  function clearFilters() {
    setSearchQuery("");
    setCategoryFilter("All");
    setOutcomeFilter("All");
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-7">
      {/* Page Heading */}
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
            Review recorded system activities, identify unsuccessful operations,
            and inspect event details for accountability.
          </p>
        </div>
      </section>

      {/* Demo Environment Notice */}
      <section className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/80 p-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
          <AlertTriangle size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-amber-950">
            Demonstration environment
          </h2>

          <p className="mt-1 text-sm leading-5 text-amber-900/80">
            These are fictional sample audit records. They do not represent
            actual logins, user actions, external system connections, or
            healthcare transactions.
          </p>
        </div>
      </section>

      {/* Statistics */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Activity Summary
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Summary counts are based on the full sample audit dataset.
          </p>
        </div>

        <AuditLogStats
          total={logs.length}
          successful={successfulCount}
          warnings={warningsCount}
          failed={failedCount}
        />
      </section>

      {/* Audit Events */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Audit Trail
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Search and filter recorded events, then open any event to view its
            details.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="border-slate-200/80 shadow-sm shadow-slate-200/30">
          <CardContent className="space-y-3 p-4">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by event, user, resource, ID, or IP address..."
                aria-label="Search audit logs"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus-visible:border-teal-600 focus-visible:ring-1 focus-visible:ring-teal-600"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label
                    htmlFor="audit-category-filter"
                    className="text-xs font-medium text-slate-500"
                  >
                    Category
                  </label>

                  <select
                    id="audit-category-filter"
                    value={categoryFilter}
                    onChange={(event) =>
                      setCategoryFilter(event.target.value as CategoryFilter)
                    }
                    className="h-10 w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus-visible:border-teal-600 focus-visible:ring-1 focus-visible:ring-teal-600"
                  >
                    <option value="All">All categories</option>

                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="audit-outcome-filter"
                    className="text-xs font-medium text-slate-500"
                  >
                    Outcome
                  </label>

                  <select
                    id="audit-outcome-filter"
                    value={outcomeFilter}
                    onChange={(event) =>
                      setOutcomeFilter(event.target.value as OutcomeFilter)
                    }
                    className="h-10 w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus-visible:border-teal-600 focus-visible:ring-1 focus-visible:ring-teal-600"
                  >
                    <option value="All">All outcomes</option>
                    <option value="Success">Success</option>
                    <option value="Warning">Warning</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  Clear filters
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Audit Logs Table */}
        <AuditLogsTable
          logs={filteredLogs}
          onView={(log) => setSelectedLog(log)}
        />

        <p className="flex items-start gap-2 text-xs leading-5 text-slate-400">
          <FileSearch size={14} className="mt-0.5 shrink-0" />

          <span>
            The audit log table and details dialog are read-only. Actual audit
            logging, access controls, and persistent storage will be handled by
            the backend when connected.
          </span>
        </p>
      </section>

      {/* Footer */}
      <footer className="flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>CareBridge · Healthcare Data Integration</p>

        <p className="inline-flex items-center gap-1.5">
          <Database size={13} />
          Academic project · Fictional records only
        </p>
      </footer>

      {/* Audit Event Details */}
      <AuditLogDetailsDialog
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
