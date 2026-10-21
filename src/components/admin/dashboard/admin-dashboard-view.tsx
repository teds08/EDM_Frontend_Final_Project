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
  Database,
  FlaskConical,
  Network,
  ReceiptText,
  ShieldCheck,
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

type ActivityFilter = "all" | "review";

const statIcons: Record<string, LucideIcon> = {
  patients: Users,
  orders: FlaskConical,
  invoices: ReceiptText,
  quality: ShieldCheck,
};

const statColors: Record<string, string> = {
  patients: "bg-blue-50 text-blue-700",
  orders: "bg-teal-50 text-teal-700",
  invoices: "bg-amber-50 text-amber-700",
  quality: "bg-rose-50 text-rose-700",
};

const integrationIcons: Record<string, LucideIcon> = {
  EMR: Users,
  LIS: FlaskConical,
  Billing: ReceiptText,
  Insurance: ShieldCheck,
};

const activityStatusStyles: Record<string, string> = {
  Success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Review: "border-amber-200 bg-amber-50 text-amber-800",
  Warning: "border-rose-200 bg-rose-50 text-rose-700",
};

export default function AdminDashboardView() {
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>("all");

  const maxOrders = Math.max(
    ...adminDashboardData.weeklyOrders.map((item) => item.count),
    1,
  );

  const totalWeeklyOrders = adminDashboardData.weeklyOrders.reduce(
    (total, item) => total + item.count,
    0,
  );

  const reviewCount = adminDashboardData.activities.filter(
    (activity) => activity.status !== "Success",
  ).length;

  const filteredActivities = adminDashboardData.activities.filter(
    (activity) => activityFilter === "all" || activity.status !== "Success",
  );

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
            Monitor healthcare data, laboratory operations, integration sources,
            and data quality in one workspace.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/data-quality"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            <Database size={16} />
            Data Quality
          </Link>

          <Link
            href="/admin/audit-logs"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-teal-800"
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
            All patient counts, transactions, audit activities, and integration
            statuses are sample values. No live healthcare systems are
            connected.
          </p>
        </div>
      </section>

      {/* Statistics */}
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {adminDashboardData.stats.map((stat) => {
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
                      className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${statColors[stat.icon] ?? "bg-slate-100 text-slate-700"}`}
                    >
                      <Icon size={21} strokeWidth={1.8} />
                    </div>
                  </div>

                  <div className="mt-4 flex min-h-5 items-center gap-1.5">
                    {stat.icon === "quality" ? (
                      <AlertTriangle
                        size={13}
                        className="shrink-0 text-amber-600"
                      />
                    ) : stat.icon === "invoices" ? (
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

      {/* Chart and integration sources */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Laboratory chart */}
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
                <Database size={12} className="mr-1.5" />
                Sample records
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

        {/* Integration sources */}
        <Card className="min-w-0 border-slate-200/80 shadow-sm shadow-slate-200/30">
          <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
            <div>
              <CardTitle className="text-base font-semibold">
                Integration Sources
              </CardTitle>

              <CardDescription className="mt-1.5">
                Healthcare data sources represented in the project.
              </CardDescription>
            </div>

            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Network size={20} />
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-1">
              {adminDashboardData.sources.map((source) => {
                const Icon = integrationIcons[source.name] ?? Database;

                const isManual = source.status === "Manual entry";

                return (
                  <div
                    key={source.name}
                    className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-white text-slate-600">
                      <Icon size={19} strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-slate-800">
                          {source.name}
                        </p>

                        <Badge
                          variant="outline"
                          className={
                            isManual
                              ? "border-slate-200 bg-slate-50 text-slate-600"
                              : "border-blue-200 bg-blue-50 text-blue-700"
                          }
                        >
                          {source.status}
                        </Badge>
                      </div>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {source.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex items-start gap-2 rounded-lg bg-slate-50 p-3">
              <Network size={15} className="mt-0.5 shrink-0 text-slate-500" />

              <p className="text-xs leading-5 text-slate-500">
                These entries represent the modules in the prototype. Their
                statuses do not indicate live external connections.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Data quality and audit activity */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[0.85fr_1.5fr]">
        {/* Data quality */}
        <Card className="min-w-0 border-slate-200/80 shadow-sm shadow-slate-200/30">
          <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
            <div>
              <CardTitle className="text-base font-semibold">
                Data Quality Overview
              </CardTitle>

              <CardDescription className="mt-1.5">
                Sample issues found during validation.
              </CardDescription>
            </div>

            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <ShieldCheck size={20} />
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {adminDashboardData.qualityIssues.map((issue) => {
              const isCritical = issue.id === "DQ-002";

              return (
                <div
                  key={issue.id}
                  className="flex items-start gap-3 rounded-xl border border-slate-100 p-3.5 transition-colors hover:bg-slate-50/80"
                >
                  <div
                    className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg ${
                      isCritical
                        ? "bg-rose-50 text-rose-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    <AlertTriangle size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-5 text-slate-800">
                      {issue.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {issue.description}
                    </p>
                  </div>

                  <div className="flex min-w-7 flex-col items-end">
                    <span className="text-lg font-semibold tabular-nums text-slate-900">
                      {issue.count}
                    </span>

                    <span className="text-[10px] text-slate-400">records</span>
                  </div>
                </div>
              );
            })}

            <Link
              href="/admin/data-quality"
              className="mt-2 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"
            >
              Review data quality
              <ArrowRight size={15} />
            </Link>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="min-w-0 border-slate-200/80 shadow-sm shadow-slate-200/30">
          <CardHeader className="gap-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base font-semibold">
                  Recent Activity
                </CardTitle>

                <CardDescription className="mt-1.5">
                  Sample actions recorded across the system.
                </CardDescription>
              </div>

              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                <Clock3 size={20} />
              </div>
            </div>

            {/* Interactive filter */}
            <div
              className="flex w-fit items-center gap-1 rounded-lg bg-slate-100 p-1"
              aria-label="Filter recent activity"
            >
              <button
                type="button"
                aria-pressed={activityFilter === "all"}
                onClick={() => setActivityFilter("all")}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  activityFilter === "all"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                All activity
              </button>

              <button
                type="button"
                aria-pressed={activityFilter === "review"}
                onClick={() => setActivityFilter("review")}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  activityFilter === "review"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Needs review
                {reviewCount > 0 && (
                  <span className="flex size-4 items-center justify-center rounded-full bg-amber-100 text-[10px] text-amber-800">
                    {reviewCount}
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
                      User
                    </th>

                    <th className="whitespace-nowrap px-5 py-3 text-xs font-semibold text-slate-500">
                      Record
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
                        <p className="font-medium text-slate-700">
                          {activity.user}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {activity.role}
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
                      <td colSpan={4} className="px-5 py-10 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle2
                            size={23}
                            className="text-emerald-600"
                          />

                          <p className="text-sm font-medium text-slate-700">
                            No activities need review
                          </p>

                          <p className="text-xs text-slate-500">
                            There are no flagged events in this demo dataset.
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
          <Database size={13} />
          Academic project · Fictional records only
        </p>
      </footer>
    </div>
  );
}
