"use client";

import { CalendarDays, Menu, X } from "lucide-react";
import { useRegistrationNavigation } from "@/components/registration/registration-navigation-context";

export function RegistrationHeader() {
  const { mobileMenuOpen, setMobileMenuOpen } = useRegistrationNavigation();

  const today = new Intl.DateTimeFormat("en-PH", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 flex min-h-20 flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4 sm:gap-4 sm:px-6 lg:static lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={
            mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={mobileMenuOpen}
          aria-controls="registration-mobile-sidebar"
          className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 lg:hidden"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">
            CareBridge / Registration
          </p>

          <h1 className="mt-1 truncate text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
            Registration Staff
          </h1>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">
          <CalendarDays className="h-4 w-4 shrink-0" />
          <span>{today}</span>
        </div>

        <div
          aria-label="Registration Staff"
          title="Registration Staff"
          className="flex size-9 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-800"
        >
          RS
        </div>
      </div>
    </header>
  );
}
