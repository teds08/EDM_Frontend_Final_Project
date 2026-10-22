"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FlaskConical,
  ReceiptText,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { adminDashboardData } from "@/data/admin-dashboard/dummy-data";

type ActivityFilter = "all" | "unpaid";

const statIcons: Record<string, LucideIcon> = {
  patients: Users,
  orders: FlaskConical,
  invoices: ReceiptText,
};

const statColors: Record<string, string> = {
  patients: "bg-blue-50 text-blue-700",
  orders: "bg-teal-50 text-teal-700",
  invoices: "bg-amber-50 text-amber-700",
};

const activityStatusStyles: Record<string, string> = {
  Success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Review: "border-amber-200 bg-amber-50 text-amber-800",
  Warning: "border-rose-200 bg-rose-50 text-rose-700",
  Unpaid: "border-rose-200 bg-rose-50 text-rose-700",
  Overdue: "border-rose-200 bg-rose-50 text-rose-700",
  Pending: "border-amber-200 bg-amber-50 text-amber-800",
};

function isUnpaidInvoiceActivity(activity: {
  action: string;
  record: string;
  status: string;
}) {
  const activityText =
    `${activity.action} ${activity.record} ${activity.status}`.toLowerCase();

  const isInvoiceRelated =
    /\binvoice\b|\bbilling\b|\bpayment\b|\breceipt\b|\binv[-#]?\d/i.test(
      activityText,
    );

  const needsPayment =
    /\bunpaid\b|\boverdue\b|\bpayment pending\b|\bawaiting payment\b|\bpayment due\b/.test(
      activityText,
    );

  return isInvoiceRelated && needsPayment;
}

export default function AdminDashboardView() {
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>("all");

  // Exclude the former Data Quality statistic.
  const visibleStats = adminDashboardData.stats.filter(
    (stat) => stat.icon !== "quality",
  );

  const maxOrders = Math.max(
    ...adminDashboardData.weeklyOrders.map((item) => item.count),
    1,
  );

  const totalWeeklyOrders = adminDashboardData.weeklyOrders.reduce(
    (total, item) => total + item.count,
    0,
  );

  const unpaidInvoiceActivities = adminDashboardData.activities.filter(
    isUnpaidInvoiceActivity,
  );

  const unpaidInvoiceCount = unpaidInvoiceActivities.length;

  const filteredActivities =
    activityFilter === "unpaid"
      ? unpaidInvoiceActivities
      : adminDashboardData.activities;

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-7">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Administration</span>
            <span className="text-slate-300">/</span>
            <span className="text-teal-700">Dashboard</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            System Overview
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Monitor staff access, laboratory activity, billing summaries, and
            recent system events in one workspace.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/users"
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            <Users size={16} />
            User Management
          </Link>

          <Link
            href="/admin/audit-logs"
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-teal-800"
          >
            <Activity size={16} />
            Audit Logs
          </Link>
        </div>
      </section>

      {/* Demo environment notice */}
      <section className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/80 p-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
          <AlertTriangle size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold text-amber-950">
              Demonstration environment
            </h2>

            <Badge
              variant="outline"
              className="border-amber-200 bg-white/70 text-amber-800"
            >
              Dummy data
            </Badge>
          </div>

          <p className="mt-1 text-sm leading-5 text-amber-900/80">
            Dashboard statistics, laboratory activity, and billing activity are
            illustrative values. User management is connected to the backend
            separately.
          </p>
        </div>
      </section>

      {/* Operational statistics */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Operational Summary
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Overview of the sample healthcare records.
            </p>
          </div>

          <span className="hidden text-xs text-slate-400 sm:inline">
            Sample statistics
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleStats.map((stat) => {
            const Icon = statIcons[stat.icon] ?? Activity;

            return (
              <Card
                key={stat.id}
                className="group border-slate-200/80 shadow-sm shadow-slate-200/30 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-500">
                        {stat.title}
                      </p>

                      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                        {stat.value}
                      </p>
                    </div>

                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
                        statColors[stat.icon] ?? "bg-slate-100 text-slate-700"
                      }`}
                    >
                      <Icon size={21} strokeWidth={1.8} />
                    </div>
                  </div>

                  <div className="mt-4 flex min-h-5 items-center gap-1.5">
                    {stat.icon === "invoices" ? (
                      <ArrowDownRight
                        size={13}
                        className="shrink-0 text-amber-600"
                      />
                    ) : (
                      <CheckCircle2
                        size={13}
                        className="shrink-0 text-slate-400"
                      />
                    )}

                    <p className="text-xs leading-5 text-slate-500">
                      {stat.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Laboratory activity */}
      <section>
        <Card className="min-w-0 border-slate-200/80 shadow-sm shadow-slate-200/30">
          <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
            <div>
              <CardTitle className="text-base font-semibold">
                Laboratory Activity
              </CardTitle>

              <CardDescription className="mt-1.5">
                Sample lab orders over seven days.
              </CardDescription>
            </div>

            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <FlaskConical size={20} />
            </div>
          </CardHeader>

          <CardContent>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 pb-5">
              <div>
                <p className="text-3xl font-semibold tracking-tight text-slate-900">
                  {totalWeeklyOrders.toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Total sample orders this week
                </p>
              </div>

              <Badge
                variant="outline"
                className="border-teal-200 bg-teal-50 text-teal-800"
              >
                <Clock3 size={12} className="mr-1.5" />
                Seven-day overview
              </Badge>
            </div>

            <div
              className="flex h-40 items-end gap-2 sm:gap-4"
              role="img"
              aria-label="Bar chart showing sample laboratory orders for each day of the week"
            >
              {adminDashboardData.weeklyOrders.map((item) => {
                const percentage = (item.count / maxOrders) * 100;

                return (
                  <div
                    key={item.day}
                    className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                  >
                    <span className="text-xs font-medium tabular-nums text-slate-600">
                      {item.count}
                    </span>

                    <div className="flex h-28 w-full items-end justify-center">
                      <div
                        className={`w-full max-w-10 rounded-t-md transition-all duration-200 ${
                          item.count === maxOrders
                            ? "bg-teal-700"
                            : "bg-teal-200 hover:bg-teal-400"
                        }`}
                        style={{
                          height: `${percentage}%`,
                          minHeight: "6px",
                        }}
                        title={`${item.day}: ${item.count} sample orders`}
                      />
                    </div>

                    <span className="text-[11px] font-medium text-slate-500">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Recent activity */}
      <section>
        <Card className="min-w-0 border-slate-200/80 shadow-sm shadow-slate-200/30">
          <CardHeader className="gap-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base font-semibold">
                  Recent Activity
                </CardTitle>

                <CardDescription className="mt-1.5">
                  Review recent patient, laboratory, and billing activities.
                </CardDescription>
              </div>

              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                <Clock3 size={20} />
              </div>
            </div>

            {/* Activity filters */}
            <div
              className="flex w-fit items-center gap-1 rounded-lg bg-slate-100 p-1"
              aria-label="Filter recent activity"
            >
              <button
                type="button"
                aria-pressed={activityFilter === "all"}
                onClick={() => setActivityFilter("all")}
                className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  activityFilter === "all"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                All Activity
              </button>

              <button
                type="button"
                aria-pressed={activityFilter === "unpaid"}
                onClick={() => setActivityFilter("unpaid")}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  activityFilter === "unpaid"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <ReceiptText size={13} />
                Unpaid Invoices
                {unpaidInvoiceCount > 0 && (
                  <span className="flex size-4 items-center justify-center rounded-full bg-rose-100 text-[10px] text-rose-800">
                    {unpaidInvoiceCount}
                  </span>
                )}
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-y border-slate-100 bg-slate-50/80">
                    <th className="whitespace-nowrap px-5 py-3 text-xs font-semibold text-slate-500">
                      Activity
                    </th>

                    <th className="whitespace-nowrap px-5 py-3 text-xs font-semibold text-slate-500">
                      Patient
                    </th>

                    <th className="whitespace-nowrap px-5 py-3 text-xs font-semibold text-slate-500">
                      Handled By
                    </th>

                    <th className="whitespace-nowrap px-5 py-3 text-xs font-semibold text-slate-500">
                      Reference ID
                    </th>

                    <th className="whitespace-nowrap px-5 py-3 text-xs font-semibold text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredActivities.map((activity) => (
                    <tr
                      key={activity.id}
                      className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <p className="min-w-40 font-medium text-slate-800">
                          {activity.action}
                        </p>

                        <p className="mt-1 whitespace-nowrap text-xs text-slate-400">
                          {activity.time}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <p className="font-medium text-slate-800">
                          {activity.patient}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">Patient</p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <p className="font-medium text-slate-700">
                          {activity.handledBy}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {activity.handledByRole}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-xs font-medium text-slate-600">
                        {activity.record}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <Badge
                          variant="outline"
                          className={
                            activityStatusStyles[activity.status] ??
                            "border-slate-200 bg-slate-50 text-slate-600"
                          }
                        >
                          {activity.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}

                  {filteredActivities.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center">
                        <div className="flex flex-col items-center gap-2">
                          {activityFilter === "unpaid" ? (
                            <CheckCircle2
                              size={23}
                              className="text-emerald-600"
                            />
                          ) : (
                            <Clock3 size={23} className="text-slate-400" />
                          )}

                          <p className="text-sm font-medium text-slate-700">
                            {activityFilter === "unpaid"
                              ? "No unpaid invoices found"
                              : "No recent activity"}
                          </p>

                          <p className="text-xs text-slate-500">
                            {activityFilter === "unpaid"
                              ? "There are no activities explicitly marked as unpaid or overdue in the current demo data."
                              : "There are no activity records to display."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
              <p className="text-xs text-slate-500">
                Showing {filteredActivities.length} of{" "}
                {adminDashboardData.activities.length} events
              </p>

              <Link
                href="/admin/audit-logs"
                className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-teal-700 transition-colors hover:text-teal-900"
              >
                View all logs
                <ArrowRight size={14} />
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>CareBridge · Healthcare Data Integration</p>

        <p className="inline-flex items-center gap-1.5">
          <Users size={13} />
          Academic project · Fictional records only
        </p>
      </footer>
    </div>
  );
}
