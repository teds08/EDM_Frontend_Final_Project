import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";

interface DemoDashboardPlaceholderProps {
  role: string;
  title: string;
  description: string;
}

export function DemoDashboardPlaceholder({
  role,
  title,
  description,
}: DemoDashboardPlaceholderProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10">
      <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
        <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          <Construction size={24} />
        </div>

        <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
          {role}
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          {title}
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>

        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">
            Dashboard under development
          </p>

          <p className="mt-1 text-sm leading-5 text-amber-800">
            This temporary page confirms that the demo login routing works. The
            actual dashboard will be developed in a later step.
          </p>
        </div>

        <Link
          href="/login"
          className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 hover:bg-slate-100"
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>
      </section>
    </main>
  );
}
