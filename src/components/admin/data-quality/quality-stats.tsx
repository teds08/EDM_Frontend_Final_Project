import {
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  Database,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface QualityStatsProps {
  total: number;
  open: number;
  inReview: number;
  resolved: number;
}

interface StatItem {
  id: string;
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  iconStyle: string;
}

export function QualityStats({
  total,
  open,
  inReview,
  resolved,
}: QualityStatsProps) {
  const stats: StatItem[] = [
    {
      id: "total",
      title: "Total Issues",
      value: total,
      description: "All detected sample issues",
      icon: Database,
      iconStyle: "bg-blue-50 text-blue-700",
    },
    {
      id: "open",
      title: "Open Issues",
      value: open,
      description: "Awaiting initial review",
      icon: AlertCircle,
      iconStyle: "bg-rose-50 text-rose-700",
    },
    {
      id: "review",
      title: "In Review",
      value: inReview,
      description: "Currently being investigated",
      icon: ClipboardCheck,
      iconStyle: "bg-amber-50 text-amber-700",
    },
    {
      id: "resolved",
      title: "Resolved",
      value: resolved,
      description: "Marked as resolved in the demo",
      icon: CheckCircle2,
      iconStyle: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <section
      aria-label="Data quality statistics"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.id}
            className="border-slate-200/80 shadow-sm shadow-slate-200/30 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>

                  <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                    {stat.value}
                  </p>
                </div>

                <div
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${stat.iconStyle}`}
                >
                  <Icon size={21} strokeWidth={1.8} />
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-500">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
