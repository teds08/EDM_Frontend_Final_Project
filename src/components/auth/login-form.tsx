"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { demoUsers } from "@/data/auth/demo-users";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const matchedUser = demoUsers.find(
      (user) =>
        user.email.toLowerCase() === email.trim().toLowerCase() &&
        user.password === password,
    );

    if (!matchedUser) {
      setError(
        "The email or password is incorrect. Check your credentials or select a demo account.",
      );
      return;
    }

    router.push(matchedUser.dashboardPath);
  }

  function selectDemoAccount(userEmail: string, userPassword: string) {
    setEmail(userEmail);
    setPassword(userPassword);
    setError("");
  }

  return (
    <div className="w-full">
      {/* Branding and heading */}
      <div className="mb-8">
        <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-teal-700 text-white shadow-lg shadow-teal-700/15">
          <ShieldCheck size={28} strokeWidth={1.8} />
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="border-teal-200 bg-teal-50 text-teal-800"
          >
            <ShieldCheck size={12} className="mr-1.5" />
            Secure staff portal
          </Badge>

          <span className="text-xs font-medium text-slate-400">CareBridge</span>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Welcome back.
        </h1>

        <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
          Sign in to your healthcare operations workspace and continue where
          your team left off.
        </p>
      </div>

      {/* Login form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label
            htmlFor="login-email"
            className="text-sm font-medium text-slate-700"
          >
            Work email
          </Label>

          <div className="relative">
            <Mail
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <Input
              id="login-email"
              type="email"
              autoComplete="username"
              placeholder="you@carebridge.demo"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              className="h-12 rounded-xl border-slate-200 bg-slate-50/60 pl-10 shadow-none transition-colors placeholder:text-slate-400 focus-visible:border-teal-600 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-teal-600 focus-visible:ring-offset-0"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label
              htmlFor="login-password"
              className="text-sm font-medium text-slate-700"
            >
              Password
            </Label>

            <span className="text-xs text-slate-400">Case-sensitive</span>
          </div>

          <div className="relative">
            <LockKeyhole
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              className="h-12 rounded-xl border-slate-200 bg-slate-50/60 pl-10 pr-12 shadow-none transition-colors placeholder:text-slate-400 focus-visible:border-teal-600 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-teal-600 focus-visible:ring-offset-0"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm leading-5 text-rose-700"
          >
            <AlertCircle size={17} className="mt-0.5 shrink-0" />

            <p>{error}</p>
          </div>
        )}

        <Button
          type="submit"
          className="h-12 w-full cursor-pointer rounded-xl bg-teal-700 font-medium text-white shadow-sm transition-all hover:bg-teal-800"
        >
          Sign in to CareBridge
          <ArrowRight size={17} className="ml-2" />
        </Button>

        <p className="text-center text-xs leading-5 text-slate-400">
          Use the account assigned to you by your administrator.
        </p>
      </form>

      {/* Demo accounts */}
      <div className="my-7 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />

        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Explore demo roles
        </span>

        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {demoUsers.map((user) => (
          <button
            key={user.role}
            type="button"
            onClick={() => selectDemoAccount(user.email, user.password)}
            className="group rounded-xl border border-slate-200 bg-white p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-50/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors group-hover:bg-teal-100 group-hover:text-teal-800">
                <UserRoundCheck size={17} />
              </div>

              <ArrowRight
                size={15}
                className="text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-teal-700"
              />
            </div>

            <span className="block text-sm font-semibold text-slate-800">
              {user.roleLabel}
            </span>

            <span className="mt-1 block break-all text-xs leading-5 text-slate-500">
              {user.email}
            </span>

            <span className="mt-3 inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600 transition-colors group-hover:bg-teal-100 group-hover:text-teal-800">
              Fill demo credentials
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
        <LockKeyhole size={16} className="mt-0.5 shrink-0 text-slate-500" />

        <div>
          <p className="text-xs font-semibold text-slate-700">
            Demo credentials
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            The sample accounts use the password{" "}
            <span className="font-semibold text-slate-700">Demo123!</span>.
            Select a role above to fill in its credentials.
          </p>
        </div>
      </div>

      {/* Administrator-managed access */}
      <div className="mt-6 border-t border-slate-200 pt-5">
        <div className="flex items-start justify-center gap-2 text-center">
          <ShieldCheck size={15} className="mt-0.5 shrink-0 text-teal-700" />

          <p className="max-w-sm text-xs leading-5 text-slate-500">
            Need a staff account? Contact your CareBridge administrator. Public
            self-registration is disabled.
          </p>
        </div>
      </div>
    </div>
  );
}
