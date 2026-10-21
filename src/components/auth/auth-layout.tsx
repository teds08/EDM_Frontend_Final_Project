"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Network,
  ShieldCheck,
} from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left Visual Panel */}
        <section className="group relative hidden min-h-screen overflow-hidden bg-slate-950 lg:flex">
          {/* Background Image */}
          <Image
            src="/images/modernbg.png"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 52vw, 100vw"
            className="z-0 object-contain object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />

          {/* Overall Dark Overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-slate-950/65 via-slate-950/45 to-teal-950/75 transition-colors duration-500 group-hover:from-slate-950/70 group-hover:via-slate-950/50 group-hover:to-teal-950/80"
          />

          {/* Darkened Edges / Vignette */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,rgba(2,6,23,0.25)_0%,rgba(2,6,23,0.55)_55%,rgba(2,6,23,0.95)_100%)]"
          />

          {/* Subtle Texture */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-[size:28px_28px] opacity-20 transition-opacity duration-500 group-hover:opacity-30"
          />

          {/* Decorative Rings */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-36 top-[18%] z-20 size-[34rem] rounded-full border border-white/10 transition-transform duration-700 ease-out group-hover:rotate-6 group-hover:scale-105"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 top-[25%] z-20 size-[23rem] rounded-full border border-teal-300/15 transition-all duration-700 group-hover:rotate-3 group-hover:border-teal-300/30"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-5 top-[32%] z-20 size-[12rem] rounded-full border border-white/10 transition-transform duration-700 group-hover:-rotate-6 group-hover:scale-110"
          />

          {/* Hero Content */}
          <div className="relative z-30 flex min-h-screen w-full flex-col px-10 py-9 xl:px-14 xl:py-11">
            {/* Branding */}
            <div className="flex items-center justify-between gap-4">
              <div className="group/brand flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-teal-200 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover/brand:rotate-3 group-hover/brand:border-teal-300/40 group-hover/brand:bg-teal-400/15">
                  <Activity
                    size={23}
                    strokeWidth={1.8}
                    className="transition-transform duration-300 group-hover/brand:scale-110"
                  />
                </div>

                <div>
                  <p className="text-lg font-semibold tracking-tight text-white transition-colors duration-300 group-hover/brand:text-teal-100">
                    CareBridge
                  </p>

                  <p className="mt-0.5 text-xs text-slate-300">
                    Healthcare Data Integration
                  </p>
                </div>
              </div>

              <div className="hidden items-center gap-2 rounded-full border border-white/15 bg-slate-950/30 px-3 py-2 text-xs font-medium text-slate-200 backdrop-blur-sm transition-all duration-300 hover:border-teal-300/40 hover:bg-slate-900/70 xl:flex">
                <span className="size-1.5 rounded-full bg-teal-300 transition-shadow duration-300 hover:shadow-[0_0_10px_rgba(94,234,212,0.8)]" />
                Staff workspace
              </div>
            </div>

            {/* Main Message */}
            <div className="flex flex-1 flex-col justify-center py-14">
              <div className="mb-6 flex w-fit items-center gap-2 rounded-full border border-teal-300/25 bg-teal-400/10 px-3.5 py-2 text-xs font-medium text-teal-100 backdrop-blur-sm transition-all duration-300 hover:border-teal-300/50 hover:bg-teal-400/15">
                <ShieldCheck
                  size={15}
                  className="transition-transform duration-300 hover:scale-110"
                />
                Connected systems. Coordinated care.
              </div>

              <h2 className="max-w-2xl text-4xl font-semibold leading-[1.12] tracking-tight text-white xl:text-6xl">
                One connected
                <span className="block text-teal-300 transition-colors duration-300 group-hover:text-teal-200">
                  healthcare workspace.
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-sm leading-7 text-slate-200 xl:text-base">
                Bringing patient information, laboratory operations, billing,
                and insurance workflows into a more connected view of healthcare
                data.
              </p>

              {/* System Connections */}
              <div className="mt-9 flex flex-wrap items-center gap-2">
                {["EMR", "LIS", "Billing", "Insurance"].map((system) => (
                  <span
                    key={system}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-slate-950/35 px-3 py-2 text-xs font-medium text-slate-100 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-300/40 hover:bg-teal-950/60 hover:text-teal-100"
                  >
                    <Network
                      size={13}
                      className="text-teal-300 transition-transform duration-300 hover:scale-110"
                    />
                    {system}
                  </span>
                ))}
              </div>

              {/* Information Panels */}
              <div className="mt-10 grid max-w-lg grid-cols-2 gap-3">
                <div className="group/card rounded-2xl border border-white/15 bg-slate-950/50 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-200/30 hover:bg-slate-950/70 hover:shadow-lg hover:shadow-black/10">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-teal-400/10 text-teal-200 transition-all duration-300 group-hover/card:border-teal-300/30 group-hover/card:bg-teal-400/20 group-hover/card:text-teal-100">
                      <Network
                        size={17}
                        className="transition-transform duration-300 group-hover/card:scale-110"
                      />
                    </div>

                    <ArrowUpRight
                      size={16}
                      className="text-slate-300 transition-transform duration-300 group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5 group-hover/card:text-teal-300"
                    />
                  </div>

                  <p className="text-sm font-semibold text-white">
                    Unified systems
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-300">
                    Bring key data sources into one workspace.
                  </p>
                </div>

                <div className="group/card rounded-2xl border border-white/15 bg-slate-950/50 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200/30 hover:bg-slate-950/70 hover:shadow-lg hover:shadow-black/10">
                  <div className="mb-3 flex size-9 items-center justify-center rounded-xl border border-white/10 bg-emerald-400/10 text-emerald-200 transition-all duration-300 group-hover/card:border-emerald-300/30 group-hover/card:bg-emerald-400/20">
                    <ShieldCheck
                      size={17}
                      className="transition-transform duration-300 group-hover/card:scale-110"
                    />
                  </div>

                  <p className="text-sm font-semibold text-white">
                    Accountable access
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-300">
                    Role-based staff access and activity tracking.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Statement */}
            <div className="flex flex-col gap-4 border-t border-white/20 pt-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <CheckCircle2
                    size={15}
                    className="text-teal-300 transition-transform duration-300 hover:scale-110"
                  />
                  Built for connected healthcare workflows
                </div>

                <p className="mt-2 text-xs text-slate-300">
                  CareBridge · Academic project demonstration
                </p>
              </div>

              <div className="group/flow flex items-center gap-1 text-xs text-slate-300">
                <span className="transition-colors duration-300 group-hover/flow:text-white">
                  Data integration
                </span>

                <ArrowDownRight
                  size={14}
                  className="transition-transform duration-300 group-hover/flow:translate-y-0.5"
                />

                <span className="transition-colors duration-300 group-hover/flow:text-teal-200">
                  Better coordination
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Login Panel */}
        <section className="relative flex min-h-screen min-w-0 flex-col justify-center overflow-y-auto bg-white px-5 py-8 sm:px-10 lg:px-10 xl:px-14">
          {/* Mobile Branding */}
          <div className="group/mobile mx-auto mb-8 flex w-full max-w-[470px] items-center gap-3 lg:hidden">
            <div className="flex size-10 items-center justify-center rounded-xl bg-teal-700 text-white transition-all duration-300 group-hover/mobile:rotate-3 group-hover/mobile:bg-teal-800">
              <Activity
                size={21}
                className="transition-transform duration-300 group-hover/mobile:scale-110"
              />
            </div>

            <div>
              <p className="font-semibold tracking-tight text-slate-900 transition-colors duration-300 group-hover/mobile:text-teal-800">
                CareBridge
              </p>

              <p className="text-xs text-slate-500">
                Healthcare Data Integration
              </p>
            </div>
          </div>

          {/* Login Content */}
          <div className="mx-auto w-full max-w-[470px]">
            {children}

            {/* Footer */}
            <footer className="mt-8 border-t border-slate-100 pt-5">
              <div className="flex flex-col items-center justify-between gap-2 text-center text-[11px] text-slate-400 sm:flex-row sm:text-left">
                <p>© 2026 CareBridge · Academic demonstration</p>

                <p className="group/footer inline-flex items-center gap-1.5 transition-colors duration-300 hover:text-teal-700">
                  <ShieldCheck
                    size={12}
                    className="transition-transform duration-300 group-hover/footer:scale-110"
                  />
                  Staff access only
                </p>
              </div>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}
