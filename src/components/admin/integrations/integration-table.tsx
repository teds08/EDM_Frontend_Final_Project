import {
  ArrowDownToLine,
  CheckCircle2,
  CircleAlert,
  Eye,
  FlaskConical,
  Network,
  ReceiptText,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type {
  Integration,
  IntegrationStatus,
} from "@/types/admin-integrations/integration";

interface IntegrationTableProps {
  integrations: Integration[];
  onView: (integration: Integration) => void;
  onTestConnection: (integration: Integration) => void;
  onSync: (integration: Integration) => void;
}

const statusStyles: Record<IntegrationStatus, string> = {
  Connected: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Disconnected: "border-slate-200 bg-slate-50 text-slate-600",
  Error: "border-rose-200 bg-rose-50 text-rose-700",
};

const integrationIcons = {
  EMR: Users,
  LIS: FlaskConical,
  Billing: ReceiptText,
  Insurance: ShieldCheck,
};

export function IntegrationTable({
  integrations,
  onView,
  onTestConnection,
  onSync,
}: IntegrationTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/30">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-5 py-3.5 text-xs font-semibold text-slate-500">
                Integration
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold text-slate-500">
                Status
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold text-slate-500">
                Records Synced
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold text-slate-500">
                Last Synchronization
              </th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {integrations.map((integration) => {
              const Icon =
                integrationIcons[
                  integration.acronym as keyof typeof integrationIcons
                ] ?? Network;

              return (
                <tr
                  key={integration.id}
                  className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/70"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-600">
                        <Icon size={19} strokeWidth={1.8} />
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800">
                          {integration.name}
                        </p>

                        <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
                          {integration.description}
                        </p>

                        <p className="mt-1 text-[11px] font-medium text-slate-400">
                          {integration.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <Badge
                      variant="outline"
                      className={statusStyles[integration.status]}
                    >
                      {integration.status === "Connected" ? (
                        <CheckCircle2 size={12} className="mr-1.5" />
                      ) : integration.status === "Error" ? (
                        <CircleAlert size={12} className="mr-1.5" />
                      ) : (
                        <Network size={12} className="mr-1.5" />
                      )}

                      {integration.status}
                    </Badge>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <p className="font-semibold tabular-nums text-slate-800">
                      {integration.recordsSynced.toLocaleString()}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Sample records
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <p className="text-slate-700">{integration.lastSynced}</p>

                    <p className="mt-1 text-xs text-slate-400">
                      Last checked: {integration.lastChecked}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onView(integration)}
                        title="View integration details"
                        aria-label={`View ${integration.name} details`}
                        className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onTestConnection(integration)}
                        className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"
                      >
                        <Network size={14} />
                        Test
                      </button>

                      <button
                        type="button"
                        onClick={() => onSync(integration)}
                        className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-teal-700 px-3 text-xs font-medium text-white transition-colors hover:bg-teal-800"
                      >
                        <ArrowDownToLine size={14} />
                        Sync
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {integrations.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-14 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Network size={26} className="text-slate-300" />

                    <p className="text-sm font-semibold text-slate-700">
                      No integrations found
                    </p>

                    <p className="max-w-sm text-xs leading-5 text-slate-500">
                      Try changing your search terms or status filter.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          Showing {integrations.length} integration
          {integrations.length === 1 ? "" : "s"}
        </p>

        <p className="text-xs text-slate-400">
          Statuses and record totals are demonstration values.
        </p>
      </div>
    </div>
  );
}
