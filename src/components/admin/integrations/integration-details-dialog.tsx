"use client";

import {
  Activity,
  ArrowDownToLine,
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  Database,
  Network,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type {
  Integration,
  IntegrationStatus,
} from "@/types/admin-integrations/integration";

interface IntegrationDetailsDialogProps {
  integration: Integration | null;
  onClose: () => void;
}

const statusStyles: Record<IntegrationStatus, string> = {
  Connected: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Disconnected: "border-slate-200 bg-slate-50 text-slate-600",
  Error: "border-rose-200 bg-rose-50 text-rose-700",
};

export function IntegrationDetailsDialog({
  integration,
  onClose,
}: IntegrationDetailsDialogProps) {
  if (!integration) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="integration-details-title"
        className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Network size={21} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                {integration.id} · Integration details
              </p>

              <h2
                id="integration-details-title"
                className="mt-1 text-lg font-semibold tracking-tight text-slate-900"
              >
                {integration.name}
              </h2>

              <p className="mt-1 text-sm leading-5 text-slate-500">
                {integration.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close integration details"
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Current demo status
              </p>

              <div className="mt-2">
                <Badge
                  variant="outline"
                  className={statusStyles[integration.status]}
                >
                  {integration.status === "Connected" ? (
                    <CheckCircle2 size={13} className="mr-1.5" />
                  ) : (
                    <CircleAlert size={13} className="mr-1.5" />
                  )}

                  {integration.status}
                </Badge>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs font-medium text-slate-500">
                Sample records synchronized
              </p>

              <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
                {integration.recordsSynced.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Database size={16} />
                <p className="text-xs font-medium">Connector</p>
              </div>

              <p className="mt-2 text-sm font-semibold text-slate-800">
                {integration.endpoint}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <ArrowDownToLine size={16} />
                <p className="text-xs font-medium">Last synchronization</p>
              </div>

              <p className="mt-2 text-sm font-semibold text-slate-800">
                {integration.lastSynced}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <CalendarClock size={16} />
                <p className="text-xs font-medium">Last connection check</p>
              </div>

              <p className="mt-2 text-sm font-semibold text-slate-800">
                {integration.lastChecked}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Activity size={16} />
                <p className="text-xs font-medium">Data exchanged</p>
              </div>

              <p className="mt-2 text-sm font-semibold text-slate-800">
                {integration.dataFlow}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-800">
              Latest activity
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {integration.lastMessage}
            </p>
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <CircleAlert size={16} className="mt-0.5 shrink-0 text-amber-700" />

            <p className="text-xs leading-5 text-amber-900">
              Demonstration only. Connection statuses, record counts, and
              synchronization activity are sample values. No external healthcare
              system is being accessed.
            </p>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="h-10 cursor-pointer rounded-lg bg-teal-700 px-5 text-sm font-medium text-white transition-colors hover:bg-teal-800"
          >
            Close
          </button>
        </div>
      </section>
    </div>
  );
}
