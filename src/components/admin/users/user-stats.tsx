import { Users, UserCheck, UserX } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface UserStatsProps {
  total: number;
  active: number;
  inactive: number;
}

export function UserStats({ total, active, inactive }: UserStatsProps) {
  const stats = [
    {
      label: "Total Users",
      value: total,
      description: "All registered accounts",
      icon: Users,
      iconClass: "bg-blue-50 text-blue-700",
    },
    {
      label: "Active Users",
      value: active,
      description: "Accounts with active access",
      icon: UserCheck,
      iconClass: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Inactive Users",
      value: inactive,
      description: "Accounts with access disabled",
      icon: UserX,
      iconClass: "bg-rose-50 text-rose-700",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.label} className="border-slate-200 shadow-sm">
            <CardContent className="flex items-start justify-between p-5">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>

                <p className="text-3xl font-semibold tracking-tight text-slate-900">
                  {stat.value}
                </p>

                <p className="text-xs text-slate-500">{stat.description}</p>
              </div>

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconClass}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
