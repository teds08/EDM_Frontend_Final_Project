import type { ReactNode } from "react";
import {
  Activity,
  Database,
  Network,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

const features: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: Network,
    title: "Connected healthcare data",
    description: "Bring patient, laboratory, and billing information together.",
  },
  {
    icon: Database,
    title: "Reliable information",
    description: "Identify duplicate records and invalid patient references.",
  },
  {
    icon: ShieldCheck,
    title: "Controlled access",
    description: "Organize access around each staff member's responsibilities.",
  },
];

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-2">
      <section className="relative hidden min-h-screen flex-col overflow-hidden bg-slate-950 px-10 py-10 text-white lg:flex xl:px-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-36 -top-28 size-[440px] rounded-full border border-white/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-8 size-[280px] rounded-full border border-teal-400/20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-28 size-[420px] rounded-full bg-teal-500/10 blur-3xl"
        />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-teal-600 text-white shadow-lg shadow-teal-950/30">
            <Activity size={24} strokeWidth={2.2} />
          </div>

          <div>
            <p className="text-lg font-semibold tracking-tight">CareBridge</p>
            <p className="text-xs text-slate-400">
              Healthcare Data Integration
            </p>
          </div>
        </div>

        <div className="relative z-10 my-auto max-w-xl py-14">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1.5 text-xs font-medium text-teal-300">
            <span className="size-1.5 rounded-full bg-teal-400" />
            HEALTHCARE OPERATIONS PLATFORM
          </div>

          <h1 className="max-w-lg text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            Healthcare data, connected with confidence.
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400 xl:text-base">
            A unified workspace for patient records, laboratory results, billing
            operations, and healthcare data quality.
          </p>

          <div className="mt-10 space-y-5">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-teal-300">
                    <Icon size={20} strokeWidth={1.8} />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-slate-100">
                      {feature.title}
                    </h2>
                    <p className="mt-1 max-w-sm text-sm leading-6 text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between gap-3 border-t border-white/10 pt-5 text-xs text-slate-500">
          <span>CareBridge · Academic Project</span>
          <span>Demo environment</span>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex size-10 items-center justify-center rounded-xl bg-teal-700 text-white">
              <Activity size={22} />
            </div>

            <div>
              <p className="font-semibold tracking-tight text-slate-900">
                CareBridge
              </p>
              <p className="text-xs text-slate-500">
                Healthcare Data Integration
              </p>
            </div>
          </div>

          {children}

          <p className="mt-8 text-center text-xs leading-5 text-slate-400">
            Academic demonstration only. No real patient information or live
            healthcare connections are used.
          </p>
        </div>
      </section>
    </main>
  );
}
