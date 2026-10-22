import { CalendarDays, ShieldCheck } from "lucide-react";

export function RegistrationHeader() {
  const today = new Intl.DateTimeFormat("en-PH", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="flex min-h-20 flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div>
        <p className="text-xs font-medium text-slate-500">
          CareBridge / Registration
        </p>
        <h1 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
          Registration Staff
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">
          <CalendarDays className="h-4 w-4" />
          {today}
        </div>

        <div className="flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700">
          <ShieldCheck className="h-4 w-4" />
          Demo Data
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-800">
          RS
        </div>
      </div>
    </header>
  );
}
