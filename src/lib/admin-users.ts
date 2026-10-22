import type {
  AdminUser,
  ApiUserRole,
  ApiUserStatus,
  BackendAdminUser,
  UserRole,
  UserStatus,
} from "@/types/admin-users/user";

const API_ROLE_BY_LABEL: Record<UserRole, ApiUserRole> = {
  Administrator: "ADMIN",
  "Registration Staff": "REGISTRATION",
  "Laboratory Staff": "LABORATORY",
  "Billing Staff": "BILLING",
};

const ROLE_LABEL_BY_CODE: Record<string, UserRole> = {
  ADMIN: "Administrator",
  ADMINISTRATOR: "Administrator",

  REGISTRATION: "Registration Staff",
  REGISTRATION_STAFF: "Registration Staff",

  LABORATORY: "Laboratory Staff",
  LABORATORY_STAFF: "Laboratory Staff",

  BILLING: "Billing Staff",
  BILLING_STAFF: "Billing Staff",
};

export function toApiUserRole(role: UserRole): ApiUserRole {
  return API_ROLE_BY_LABEL[role];
}

export function fromApiUserRole(role: string): UserRole {
  const normalizedRole = role
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
  const mappedRole = ROLE_LABEL_BY_CODE[normalizedRole];

  if (!mappedRole) {
    throw new Error(`Unsupported user role returned by the backend: ${role}`);
  }

  return mappedRole;
}

export function toApiUserStatus(status: UserStatus): ApiUserStatus {
  return status === "Active" ? "ACTIVE" : "INACTIVE";
}

function formatLastActivity(value?: string | null): string {
  if (!value) {
    return "Never";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export function mapBackendUser(user: BackendAdminUser): AdminUser {
  return {
    id: String(user.id),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: fromApiUserRole(user.role),
    status: user.status.toUpperCase() === "ACTIVE" ? "Active" : "Inactive",
    lastActivity: formatLastActivity(user.lastActivity),
    createdAt: user.createdAt,
  };
}
