"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
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
        "The email or password is incorrect. Use one of the demo accounts below.",
      );
      return;
    }

    router.push(matchedUser.dashboardPath);
  }

  return (
    <div>
      <div className="mb-8">
        <Badge
          variant="outline"
          className="mb-4 border-teal-200 bg-teal-50 text-teal-800"
        >
          <ShieldCheck size={13} className="mr-1.5" />
          Staff access
        </Badge>

        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Welcome back
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Sign in to access your healthcare operations workspace.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="login-email">Work email</Label>

          <div className="relative">
            <Mail
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <Input
              id="login-email"
              type="email"
              autoComplete="username"
              placeholder="you@carebridge.demo"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 border-slate-200 pl-10 focus-visible:ring-teal-600"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="login-password">Password</Label>

            <span className="text-xs text-slate-400">Demo credentials</span>
          </div>

          <div className="relative">
            <LockKeyhole
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 border-slate-200 pl-10 pr-11 focus-visible:ring-teal-600"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700"
          >
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="h-11 w-full bg-teal-700 font-medium text-white hover:bg-teal-800"
        >
          Sign in
          <ArrowRight size={17} className="ml-2" />
        </Button>
      </form>

      <div className="my-7 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium text-slate-400">
          DEMO ACCOUNTS
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {demoUsers.map((user) => (
          <button
            key={user.role}
            type="button"
            onClick={() => {
              setEmail(user.email);
              setPassword(user.password);
              setError("");
            }}
            className="rounded-lg border border-slate-200 bg-white p-3 text-left transition-colors hover:border-teal-300 hover:bg-teal-50/50"
          >
            <span className="block text-sm font-semibold text-slate-800">
              {user.roleLabel}
            </span>

            <span className="mt-1 block break-all text-xs text-slate-500">
              {user.email}
            </span>

            <span className="mt-2 block text-xs font-medium text-teal-700">
              Use demo account
            </span>
          </button>
        ))}
      </div>

      <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2.5 text-xs leading-5 text-slate-500">
        Each demo account uses the password{" "}
        <span className="font-semibold text-slate-700">Demo123!</span>.
        Selecting an account fills in its demo credentials.
      </p>

      <p className="mt-7 text-center text-sm text-slate-600">
        Need a staff account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-teal-700 hover:text-teal-800"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
