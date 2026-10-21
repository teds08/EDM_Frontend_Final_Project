"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Info,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { QualityStats } from "@/components/admin/data-quality/quality-stats";
import { QualityIssuesTable } from "@/components/admin/data-quality/quality-issues-table";
import { QualityIssueDetailsDialog } from "@/components/admin/data-quality/quality-issue-details-dialog";

import { initialQualityIssues } from "@/data/admin-data-quality/dummy-data";

import type {
  QualityCategory,
  QualityIssue,
  QualitySeverity,
  QualityStatus,
} from "@/types/admin-data-quality/quality-issue";

type StatusFilter = "All" | QualityStatus;
type SeverityFilter = "All" | QualitySeverity;
type CategoryFilter = "All" | QualityCategory;
type NoticeType = "success" | "warning" | "info";

interface PageNotice {
  type: NoticeType;
  message: string;
}

const categories: QualityCategory[] = [
  "Missing Data",
  "Duplicate Records",
  "Invalid Format",
  "Inconsistent Data",
];

const noticeStyles: Record<NoticeType, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  info: "border-blue-200 bg-blue-50 text-blue-900",
};

export default function DataQualityView() {
  const [issues, setIssues] = useState<QualityIssue[]>(initialQualityIssues);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("All");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");

  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  const [notice, setNotice] = useState<PageNotice | null>(null);

  const selectedIssue =
    issues.find((issue) => issue.id === selectedIssueId) ?? null;

  const stats = useMemo(
    () => ({
      total: issues.length,
      open: issues.filter((issue) => issue.status === "Open").length,
      inReview: issues.filter((issue) => issue.status === "In Review").length,
      resolved: issues.filter((issue) => issue.status === "Resolved").length,
    }),
    [issues],
  );

  const filteredIssues = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return issues.filter((issue) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        [
          issue.id,
          issue.title,
          issue.description,
          issue.source,
          issue.category,
        ].some((value) => value.toLowerCase().includes(normalizedQuery));

      const matchesStatus =
        statusFilter === "All" || issue.status === statusFilter;

      const matchesSeverity =
        severityFilter === "All" || issue.severity === severityFilter;

      const matchesCategory =
        categoryFilter === "All" || issue.category === categoryFilter;

      return (
        matchesSearch && matchesStatus && matchesSeverity && matchesCategory
      );
    });
  }, [issues, searchQuery, statusFilter, severityFilter, categoryFilter]);

  const criticalCount = issues.filter(
    (issue) => issue.severity === "Critical",
  ).length;

  const highSeverityCount = issues.filter(
    (issue) => issue.severity === "High",
  ).length;

  function handleAdvanceStatus(issue: QualityIssue) {
    let nextStatus: QualityStatus;

    if (issue.status === "Open") {
      nextStatus = "In Review";
    } else if (issue.status === "In Review") {
      nextStatus = "Resolved";
    } else {
      nextStatus = "Open";
    }

    setIssues((currentIssues) =>
      currentIssues.map((currentIssue) =>
        currentIssue.id === issue.id
          ? { ...currentIssue, status: nextStatus }
          : currentIssue,
      ),
    );

    if (nextStatus === "In Review") {
      setNotice({
        type: "info",
        message: `${issue.id} moved to In Review. This status change exists only in the current frontend session.`,
      });
    } else if (nextStatus === "Resolved") {
      setNotice({
        type: "success",
        message: `${issue.id} marked as Resolved in the demo. No source healthcare records were changed.`,
      });
    } else {
      setNotice({
        type: "warning",
        message: `${issue.id} reopened for another review in the demo.`,
      });
    }
  }

  function clearFilters() {
    setSearchQuery("");
    setStatusFilter("All");
    setSeverityFilter("All");
    setCategoryFilter("All");
  }

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    statusFilter !== "All" ||
    severityFilter !== "All" ||
    categoryFilter !== "All";

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-7">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Administration</span>
            <span className="text-slate-300">/</span>
            <span className="text-teal-700">Data Quality</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Data Quality
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Review sample data issues across healthcare systems, investigate
            potential inconsistencies, and manage their review status.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-600 shadow-sm">
          <ShieldCheck size={15} className="text-teal-700" />
          Data validation overview
        </div>
      </section>

      {/* Demonstration notice */}
      <section className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/80 p-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
          <AlertTriangle size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-amber-950">
            Demonstration environment
          </h2>

          <p className="mt-1 text-sm leading-5 text-amber-900/80">
            The issues, affected-record counts, and suggested actions below are
            fictional sample data. This page does not scan real databases,
            modify clinical records, or persist status changes to a backend.
          </p>
        </div>
      </section>

      {/* Operation feedback */}
      {notice && (
        <section
          role="status"
          className={`flex items-start gap-3 rounded-xl border p-3.5 ${noticeStyles[notice.type]}`}
        >
          {notice.type === "success" ? (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          ) : notice.type === "warning" ? (
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          ) : (
            <Info size={18} className="mt-0.5 shrink-0" />
          )}

          <p className="flex-1 text-sm leading-6">{notice.message}</p>

          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Dismiss notification"
            className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-black/5"
          >
            <X size={15} />
          </button>
        </section>
      )}

      {/* Statistics */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Quality Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Summary of detected issues and their review progress.
          </p>
        </div>

        <QualityStats
          total={stats.total}
          open={stats.open}
          inReview={stats.inReview}
          resolved={stats.resolved}
        />
      </section>

      {/* Severity summary */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="border-rose-200/80 shadow-sm shadow-slate-200/20">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
              <AlertTriangle size={19} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800">
                Critical Issues
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Issues requiring priority investigation.
              </p>
            </div>

            <p className="text-2xl font-semibold tabular-nums text-rose-700">
              {criticalCount}
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200/80 shadow-sm shadow-slate-200/20">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <ClipboardCheckIcon />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800">
                High-Severity Issues
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Issues that need careful data verification.
              </p>
            </div>

            <p className="text-2xl font-semibold tabular-nums text-amber-700">
              {highSeverityCount}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Issue list */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Data Quality Issues
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Search, filter, inspect, and update the review status of sample
            issues.
          </p>
        </div>

        {/* Search and filters */}
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
                placeholder="Search by issue name, ID, source, or category..."
                aria-label="Search data quality issues"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus-visible:border-teal-600 focus-visible:ring-1 focus-visible:ring-teal-600"
              />
            </div>

            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
              <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor="quality-status-filter"
                    className="text-xs font-medium text-slate-500"
                  >
                    Status
                  </label>

                  <select
                    id="quality-status-filter"
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value as StatusFilter)
                    }
                    className="h-10 w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus-visible:border-teal-600 focus-visible:ring-1 focus-visible:ring-teal-600"
                  >
                    <option value="All">All statuses</option>
                    <option value="Open">Open</option>
                    <option value="In Review">In Review</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="quality-severity-filter"
                    className="text-xs font-medium text-slate-500"
                  >
                    Severity
                  </label>

                  <select
                    id="quality-severity-filter"
                    value={severityFilter}
                    onChange={(event) =>
                      setSeverityFilter(event.target.value as SeverityFilter)
                    }
                    className="h-10 w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus-visible:border-teal-600 focus-visible:ring-1 focus-visible:ring-teal-600"
                  >
                    <option value="All">All severities</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2 xl:col-span-1">
                  <label
                    htmlFor="quality-category-filter"
                    className="text-xs font-medium text-slate-500"
                  >
                    Category
                  </label>

                  <select
                    id="quality-category-filter"
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
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="h-10 shrink-0 cursor-pointer rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  Clear filters
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        <QualityIssuesTable
          issues={filteredIssues}
          onView={(issue) => setSelectedIssueId(issue.id)}
          onAdvanceStatus={handleAdvanceStatus}
        />
      </section>

      {/* Footer */}
      <footer className="flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>CareBridge · Healthcare Data Integration</p>

        <p className="inline-flex items-center gap-1.5">
          <Database size={13} />
          Academic project · Fictional records only
        </p>
      </footer>

      {/* Details dialog */}
      <QualityIssueDetailsDialog
        issue={selectedIssue}
        onClose={() => setSelectedIssueId(null)}
        onAdvanceStatus={handleAdvanceStatus}
      />
    </div>
  );
}

function ClipboardCheckIcon() {
  return <CheckCircle2 size={19} />;
}
