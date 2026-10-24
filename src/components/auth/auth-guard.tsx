"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, LoaderCircle, LogIn } from "lucide-react";

import { AUTH_ROLE_KEY, AUTH_TOKEN_KEY } from "@/lib/api";

export type AuthRole = "ADMIN" | "REGISTRATION" | "LABORATORY" | "BILLING";

interface AuthGuardProps {
  children: ReactNode;
  requiredRole: AuthRole;
}

interface JwtPayload {
  exp: number;
}

interface RoleInfo {
  role: AuthRole;
  dashboardPath: string;
  label: string;
}

const ROLE_INFO: Record<AuthRole, RoleInfo> = {
  ADMIN: {
    role: "ADMIN",
    dashboardPath: "/admin/dashboard",
    label: "administrator",
  },
  REGISTRATION: {
    role: "REGISTRATION",
    dashboardPath: "/registration/dashboard",
    label: "registration staff",
  },
  LABORATORY: {
    role: "LABORATORY",
    dashboardPath: "/laboratory/dashboard",
    label: "laboratory staff",
  },
  BILLING: {
    role: "BILLING",
    dashboardPath: "/billing/dashboard",
    label: "billing staff",
  },
};

function getRoleInfo(role: string): RoleInfo | null {
  const normalizedRole = role
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

  switch (normalizedRole) {
    case "ADMIN":
    case "ADMINISTRATOR":
      return ROLE_INFO.ADMIN;

    case "REGISTRATION":
    case "REGISTRATION_STAFF":
      return ROLE_INFO.REGISTRATION;

    case "LABORATORY":
    case "LABORATORY_STAFF":
      return ROLE_INFO.LABORATORY;

    case "BILLING":
    case "BILLING_STAFF":
      return ROLE_INFO.BILLING;

    default:
      return null;
  }
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

    const payload: unknown = JSON.parse(window.atob(paddedPayload));

    if (
      typeof payload !== "object" ||
      payload === null ||
      Array.isArray(payload)
    ) {
      return null;
    }

    const exp = (payload as Record<string, unknown>).exp;

    // An expiration claim is required for managed session expiration.
    if (typeof exp !== "number" || !Number.isFinite(exp)) {
      return null;
    }

    return { exp };
  } catch {
    return null;
  }
}

function clearCredentials() {
  window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
  window.sessionStorage.removeItem(AUTH_ROLE_KEY);
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  const requiredRoleInfo = ROLE_INFO[requiredRole];

  useEffect(() => {
    let cancelled = false;
    let expiryTimer: number | undefined;

    const clearExpiryTimer = () => {
      if (expiryTimer !== undefined) {
        window.clearTimeout(expiryTimer);
        expiryTimer = undefined;
      }
    };

    const expireSession = () => {
      if (cancelled) return;

      clearExpiryTimer();
      clearCredentials();
      setSessionExpired(true);
    };

    const scheduleExpiryCheck = (expiresAt: number) => {
      if (cancelled) return;

      const remaining = expiresAt - Date.now();

      if (remaining <= 0) {
        expireSession();
        return;
      }

      clearExpiryTimer();

      // Keep timer delays within the browser's supported timer range.
      expiryTimer = window.setTimeout(
        () => scheduleExpiryCheck(expiresAt),
        Math.min(remaining, 2_147_000_000),
      );
    };

    const redirectToLogin = () => {
      clearExpiryTimer();
      clearCredentials();
      router.replace("/login");
    };

    const checkCurrentSession = (): boolean => {
      const token = window.sessionStorage.getItem(AUTH_TOKEN_KEY);
      const role = window.sessionStorage.getItem(AUTH_ROLE_KEY);

      if (!token || !role) {
        redirectToLogin();
        return false;
      }

      const payload = getJwtPayload(token);

      if (!payload) {
        redirectToLogin();
        return false;
      }

      const expiresAt = payload.exp * 1000;

      if (expiresAt <= Date.now()) {
        expireSession();
        return false;
      }

      const roleInfo = getRoleInfo(role);

      if (!roleInfo) {
        redirectToLogin();
        return false;
      }

      if (roleInfo.role !== requiredRole) {
        clearExpiryTimer();
        router.replace(roleInfo.dashboardPath);
        return false;
      }

      scheduleExpiryCheck(expiresAt);
      return true;
    };

    async function verifySession() {
      await Promise.resolve();

      if (cancelled) return;

      if (checkCurrentSession() && !cancelled) {
        setAuthorized(true);
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible" || cancelled) return;

      const token = window.sessionStorage.getItem(AUTH_TOKEN_KEY);

      // Preserve the expiry modal if the expired session was already cleared.
      if (!token && sessionExpired) return;

      checkCurrentSession();
    };

    void verifySession();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);

    return () => {
      cancelled = true;
      clearExpiryTimer();

      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, [router, requiredRole, sessionExpired]);

  const handleLoginAgain = () => {
    clearCredentials();
    router.replace("/login");
  };

  if (!authorized && !sessionExpired) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <LoaderCircle className="size-5 animate-spin text-teal-700" />
          Verifying {requiredRoleInfo.label} access...
        </div>
      </div>
    );
  }

  return (
    <>
      {authorized && children}

      {sessionExpired && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="session-expired-title"
            aria-describedby="session-expired-description"
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertCircle className="h-7 w-7" />
            </div>

            <div className="mt-5 text-center">
              <h2
                id="session-expired-title"
                className="text-xl font-semibold tracking-tight text-slate-900"
              >
                Your Session Has Expired
              </h2>

              <p
                id="session-expired-description"
                className="mt-3 text-sm leading-6 text-slate-500"
              >
                For your security, your {requiredRoleInfo.label} session has
                ended. Please log in again to continue.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLoginAgain}
              className="mt-7 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              <LogIn className="h-4 w-4" />
              Login Again
            </button>

            <p className="mt-4 text-center text-xs text-slate-400">
              Your session credentials have been cleared.
            </p>
          </section>
        </div>
      )}
    </>
  );
}
