"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  LoaderCircle,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest, AUTH_ROLE_KEY, AUTH_TOKEN_KEY } from "@/lib/api";

interface AuthenticatedUser {
  role?: string;
  roleName?: string;
  roleCode?: string;
}

interface LoginPayload {
  token?: string;
  user?: AuthenticatedUser;
  role?: string;
  roleName?: string;
  roleCode?: string;
}

interface LoginResponse {
  success?: boolean;
  message?: string;
  token?: string;
  role?: string;
  roleName?: string;
  roleCode?: string;
  user?: AuthenticatedUser;
  data?: LoginPayload;
}

function getDashboardPath(roleValue: unknown): string | null {
  const role = String(roleValue ?? "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

  switch (role) {
    case "ADMIN":
    case "ADMINISTRATOR":
      return "/admin/dashboard";

    case "REGISTRATION":
    case "REGISTRATION_STAFF":
      return "/registration/dashboard";

    case "LABORATORY":
    case "LABORATORY_STAFF":
      return "/laboratory/dashboard";

    case "BILLING":
    case "BILLING_STAFF":
      return "/billing/dashboard";

    default:
      return null;
  }
}

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await apiRequest<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = response.data ?? response;
      const user = data.user ?? response.user;

      const token = data.token ?? response.token;

      const role =
        user?.role ??
        user?.roleName ??
        user?.roleCode ??
        data.role ??
        data.roleName ??
        data.roleCode ??
        response.role ??
        response.roleName ??
        response.roleCode;

      if (!token) {
        throw new Error(
          "The backend login response did not include an access token.",
        );
      }

      const dashboardPath = getDashboardPath(role);

      if (!dashboardPath) {
        throw new Error(
          "Your account was authenticated, but its assigned role is not recognized by this frontend.",
        );
      }

      // Store the token and role for the protected dashboard layout.
      window.sessionStorage.setItem(AUTH_TOKEN_KEY, token);
      window.sessionStorage.setItem(AUTH_ROLE_KEY, String(role).trim());

      router.replace(dashboardPath);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      {/* Centered Branding */}
      <div className="mb-6 text-center">
        <div className="relative mx-auto mb-4 flex size-[76px] items-center justify-center">
          <div className="absolute inset-2 rotate-6 rounded-[23px] bg-teal-100 transition-transform duration-300 hover:rotate-12" />

          <div className="absolute inset-1 rounded-[23px] border border-teal-200/80 bg-white shadow-sm" />

          <div className="group relative flex size-[52px] items-center justify-center rounded-2xl bg-teal-700 text-white shadow-lg shadow-teal-700/20 transition-all duration-300 hover:scale-105 hover:bg-teal-800">
            <ShieldCheck
              size={27}
              strokeWidth={1.7}
              className="transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          <span className="absolute right-0 top-1 flex size-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500">
            <span className="size-1.5 rounded-full bg-white" />
          </span>
        </div>

        <div className="mb-3 flex justify-center">
          <Badge
            variant="outline"
            className="border-teal-200 bg-teal-50 px-3 py-1 text-teal-800"
          >
            <Activity size={12} className="mr-1.5" />
            Secure staff portal
          </Badge>
        </div>

        <p className="text-sm font-semibold tracking-tight text-teal-800">
          Connecting Healthcare Data.
          <span className="block text-teal-700">Bridging Better Care.</span>
        </p>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
          Welcome back
        </h1>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-5 text-slate-500">
          Access your workspace for patient information, laboratory operations,
          billing, and insurance workflows.
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
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
              disabled={isSubmitting}
              className="h-11 rounded-xl border-slate-200 bg-slate-50/60 pl-10 shadow-none transition-colors placeholder:text-slate-400 focus-visible:border-teal-600 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-teal-600 focus-visible:ring-offset-0"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
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
              disabled={isSubmitting}
              className="h-11 rounded-xl border-slate-200 bg-slate-50/60 pl-10 pr-12 shadow-none transition-colors placeholder:text-slate-400 focus-visible:border-teal-600 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-teal-600 focus-visible:ring-offset-0"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              disabled={isSubmitting}
              className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm leading-5 text-rose-700"
          >
            <AlertCircle size={17} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="group h-11 w-full cursor-pointer rounded-xl bg-teal-700 font-medium text-white shadow-sm transition-all hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle size={17} className="mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in to CareBridge
              <ArrowRight
                size={17}
                className="ml-2 transition-transform group-hover:translate-x-0.5"
              />
            </>
          )}
        </Button>

        <p className="text-center text-xs leading-5 text-slate-400">
          Use the account assigned to you by your administrator.
        </p>
      </form>

      {/* Backend Authentication Notice */}
      <div className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
        <LockKeyhole size={13} className="shrink-0 text-slate-400" />

        <p className="text-center text-[11px] leading-4 text-slate-500">
          Your credentials are verified by the CareBridge server.
        </p>
      </div>

      {/* Administrator-Managed Access */}
      <div className="mt-4 border-t border-slate-200 pt-4">
        <div className="flex items-start justify-center gap-2 text-center">
          <ShieldCheck size={14} className="mt-0.5 shrink-0 text-teal-700" />

          <p className="max-w-sm text-xs leading-5 text-slate-500">
            Need a staff account? Contact your CareBridge administrator. Public
            self-registration is disabled.
          </p>
        </div>
      </div>
    </div>
  );
}
