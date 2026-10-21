"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type RequestedRole = "registration" | "laboratory" | "billing";

export function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<RequestedRole>("registration");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitted(false);

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setSubmitted(true);
  }

  return (
    <div>
      <div className="mb-7">
        <Badge
          variant="outline"
          className="mb-4 border-teal-200 bg-teal-50 text-teal-800"
        >
          <Users size={13} className="mr-1.5" />
          Staff registration
        </Badge>

        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Create an account
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Enter your details to request access to the CareBridge workspace.
        </p>
      </div>

      {submitted && (
        <div
          role="status"
          className="mb-5 rounded-xl border border-teal-200 bg-teal-50 p-4"
        >
          <div className="flex items-start gap-2.5">
            <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-teal-700" />

            <div>
              <p className="text-sm font-semibold text-teal-900">
                Form validation successful
              </p>

              <p className="mt-1 text-sm leading-5 text-teal-800">
                Your details are valid, but no account was created or saved.
                Backend registration and administrator approval will be
                implemented later.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-name">Full name</Label>

          <div className="relative">
            <UserRound
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <Input
              id="signup-name"
              type="text"
              autoComplete="name"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="h-11 border-slate-200 pl-10 focus-visible:ring-teal-600"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-email">Work email</Label>

          <div className="relative">
            <Mail
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <Input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 border-slate-200 pl-10 focus-visible:ring-teal-600"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-role">Requested staff role</Label>

          <select
            id="signup-role"
            value={role}
            onChange={(event) => setRole(event.target.value as RequestedRole)}
            className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-teal-600"
            required
          >
            <option value="registration">Registration Staff</option>
            <option value="laboratory">Laboratory Staff</option>
            <option value="billing">Billing Staff</option>
          </select>

          <p className="text-xs leading-5 text-slate-500">
            Administrator access cannot be requested through public signup.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>

          <div className="relative">
            <LockKeyhole
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <Input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 border-slate-200 pl-10 pr-11 focus-visible:ring-teal-600"
              minLength={8}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-confirm-password">Confirm password</Label>

          <div className="relative">
            <LockKeyhole
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <Input
              id="signup-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="h-11 border-slate-200 pl-10 pr-11 focus-visible:ring-teal-600"
              minLength={8}
              required
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((previous) => !previous)}
              aria-label={
                showConfirmPassword
                  ? "Hide confirmation password"
                  : "Show confirmation password"
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
          Validate registration form
          <ArrowRight size={17} className="ml-2" />
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-teal-700 hover:text-teal-800"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
