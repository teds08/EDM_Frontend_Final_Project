"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Info,
  Network,
  Search,
  X,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { IntegrationStats } from "@/components/admin/integrations/integration-stats";
import { IntegrationTable } from "@/components/admin/integrations/integration-table";
import { IntegrationDetailsDialog } from "@/components/admin/integrations/integration-details-dialog";

import { initialIntegrations } from "@/data/admin-integrations/dummy-data";

import type {
  Integration,
  IntegrationStatus,
} from "@/types/admin-integrations/integration";

type StatusFilter = "All" | IntegrationStatus;
type NoticeType = "success" | "warning" | "info";

interface PageNotice {
  type: NoticeType;
  message: string;
}

const noticeStyles: Record<NoticeType, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  info: "border-blue-200 bg-blue-50 text-blue-900",
};

export default function IntegrationsView() {
  const [integrations, setIntegrations] =
    useState<Integration[]>(initialIntegrations);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<
    string | null
  >(null);
  const [notice, setNotice] = useState<PageNotice | null>(null);

  const selectedIntegration =
    integrations.find(
      (integration) => integration.id === selectedIntegrationId,
    ) ?? null;

  const filteredIntegrations = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return integrations.filter((integration) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        [
          integration.name,
          integration.acronym,
          integration.description,
          integration.id,
        ].some((value) => value.toLowerCase().includes(normalizedQuery));

      const matchesStatus =
        statusFilter === "All" || integration.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [integrations, searchQuery, statusFilter]);

  const connectedCount = integrations.filter(
    (integration) => integration.status === "Connected",
  ).length;

  const disconnectedCount = integrations.filter(
    (integration) => integration.status === "Disconnected",
  ).length;

  const attentionCount = integrations.filter(
    (integration) => integration.status !== "Connected",
  ).length;

  function handleTestConnection(integration: Integration) {
    const timestamp = "Just now";
    const isConnected = integration.status === "Connected";

    const message = isConnected
      ? "Simulated check completed. This integration remains marked as connected. No external endpoint was contacted."
      : integration.status === "Error"
        ? "Simulated check completed. The existing error status remains unchanged. No live connection was tested."
        : "Simulated check completed. This integration remains disconnected because no live connector is configured.";

    setIntegrations((currentIntegrations) =>
      currentIntegrations.map((item) =>
        item.id === integration.id
          ? {
              ...item,
              lastChecked: timestamp,
              lastMessage: message,
            }
          : item,
      ),
    );

    setNotice({
      type: isConnected ? "success" : "warning",
      message: isConnected
        ? `${integration.acronym}: the demo status is Connected. No real connection test was performed.`
        : `${integration.acronym}: the simulated check did not establish a live connection.`,
    });
  }

  function handleSync(integration: Integration) {
    if (integration.status !== "Connected") {
      setNotice({
        type: "warning",
        message: `${integration.acronym} cannot run the demo sync while its status is ${integration.status}.`,
      });

      return;
    }

    const updatedRecordCount = integration.recordsSynced + 10;

    setIntegrations((currentIntegrations) =>
      currentIntegrations.map((item) =>
        item.id === integration.id
          ? {
              ...item,
              recordsSynced: updatedRecordCount,
              lastSynced: "Just now",
              lastChecked: "Just now",
              lastMessage:
                "Local demo synchronization completed. Ten were added to the sample record count. No external records were transferred.",
            }
          : item,
      ),
    );

    setNotice({
      type: "success",
      message: `${integration.acronym}: demo synchronization completed. Ten were added to the sample record count in frontend state only.`,
    });
  }

  function clearFilters() {
    setSearchQuery("");
    setStatusFilter("All");
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-7">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Administration</span>
            <span className="text-slate-300">/</span>
            <span className="text-teal-700">Integrations</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Integrations
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Review healthcare data sources, monitor their sample connection
            statuses, and simulate synchronization activity.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-600 shadow-sm">
          <Network size={15} className="text-teal-700" />
          {integrations.length} registered sources
        </div>
      </section>

      {/* Demo environment notice */}
      <section className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/80 p-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
          <AlertTriangle size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-amber-950">
            Demonstration environment
          </h2>

          <p className="mt-1 text-sm leading-5 text-amber-900/80">
            All integration details, connection statuses, record totals, and
            synchronization results are fictional. The actions on this page
            modify local frontend state only. No live EMR, LIS, billing, or
            insurance system is connected.
          </p>
        </div>
      </section>

      {/* Action feedback */}
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
            Integration Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Summary of registered healthcare data sources.
          </p>
        </div>

        <IntegrationStats
          total={integrations.length}
          connected={connectedCount}
          disconnected={disconnectedCount}
          attention={attentionCount}
        />
      </section>

      {/* Integrations list */}
      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Healthcare Data Sources
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View the registered connectors and their current demo statuses.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Database size={14} />
            Sample integration records
          </div>
        </div>

        {/* Search and filters */}
        <Card className="border-slate-200/80 shadow-sm shadow-slate-200/30">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by system name, type, or ID..."
                aria-label="Search integrations"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus-visible:border-teal-600 focus-visible:ring-1 focus-visible:ring-teal-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label
                htmlFor="integration-status-filter"
                className="text-xs font-medium text-slate-500"
              >
                Status
              </label>

              <select
                id="integration-status-filter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as StatusFilter)
                }
                className="h-10 min-w-40 cursor-pointer rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus-visible:border-teal-600 focus-visible:ring-1 focus-visible:ring-teal-600"
              >
                <option value="All">All statuses</option>
                <option value="Connected">Connected</option>
                <option value="Disconnected">Disconnected</option>
                <option value="Error">Error</option>
              </select>

              {(searchQuery || statusFilter !== "All") && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="h-10 cursor-pointer rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  Clear
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        <IntegrationTable
          integrations={filteredIntegrations}
          onView={(integration) => setSelectedIntegrationId(integration.id)}
          onTestConnection={handleTestConnection}
          onSync={handleSync}
        />
      </section>

      {/* Page footer */}
      <footer className="flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>CareBridge · Healthcare Data Integration</p>

        <p className="inline-flex items-center gap-1.5">
          <Database size={13} />
          Academic project · Fictional records only
        </p>
      </footer>

      {/* Integration details */}
      <IntegrationDetailsDialog
        integration={selectedIntegration}
        onClose={() => setSelectedIntegrationId(null)}
      />
    </div>
  );
}
