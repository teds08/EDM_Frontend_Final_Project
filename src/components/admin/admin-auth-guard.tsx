"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import { AUTH_ROLE_KEY, AUTH_TOKEN_KEY } from "@/lib/api";

interface AdminAuthGuardProps {
  children: ReactNode;
}

interface JwtPayload {
  exp?: number;
}

function getJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const encodedPayload = parts[1].replace(/-/g, "+").replace(/_/g, "/");

    const paddedPayload = encodedPayload.padEnd(
      Math.ceil(encodedPayload.length / 4) * 4,
      "=",
    );

    return JSON.parse(window.atob(paddedPayload)) as JwtPayload;
  } catch {
    return null;
  }
}

function getDashboardPath(role: string): string | null {
  const normalizedRole = role
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

  switch (normalizedRole) {
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

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function verifySession() {
      // Defer state updates until after the effect begins.
      await Promise.resolve();

      if (cancelled) {
        return;
      }

      const token = window.sessionStorage.getItem(AUTH_TOKEN_KEY);
      const role = window.sessionStorage.getItem(AUTH_ROLE_KEY);

      if (!token || !role) {
        window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
        window.sessionStorage.removeItem(AUTH_ROLE_KEY);
        router.replace("/login");
        return;
      }

      const payload = getJwtPayload(token);

      if (!payload) {
        window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
        window.sessionStorage.removeItem(AUTH_ROLE_KEY);
        router.replace("/login");
        return;
      }

      if (typeof payload.exp === "number" && payload.exp * 1000 <= Date.now()) {
        window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
        window.sessionStorage.removeItem(AUTH_ROLE_KEY);
        router.replace("/login");
        return;
      }

      const dashboardPath = getDashboardPath(role);

      if (!dashboardPath) {
        window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
        window.sessionStorage.removeItem(AUTH_ROLE_KEY);
        router.replace("/login");
        return;
      }

      if (dashboardPath !== "/admin/dashboard") {
        router.replace(dashboardPath);
        return;
      }

      if (!cancelled) {
        setAuthorized(true);
      }
    }

    void verifySession();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <LoaderCircle className="size-5 animate-spin text-teal-700" />
          Verifying administrator access...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
