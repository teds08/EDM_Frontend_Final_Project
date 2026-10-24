import { apiRequest } from "@/lib/api";
import type {
  AuditLogListResponse,
  AuditLogQueryParams,
} from "@/types/admin-audit-logs/audit-log";

function buildAuditLogQuery(params: AuditLogQueryParams = {}): string {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    query.set(key, String(value));
  }

  const queryString = query.toString();

  return queryString ? `?${queryString}` : "";
}

/**
 * Retrieves system-wide audit logs.
 * Access is enforced by the backend for Admin users.
 */
export function getAdminAuditLogs(
  params: AuditLogQueryParams = {},
): Promise<AuditLogListResponse> {
  return apiRequest<AuditLogListResponse>(
    `/api/audit-logs${buildAuditLogQuery(params)}`,
  );
}

/**
 * Retrieves the authenticated Registration Staff member's
 * permitted audit logs.
 *
 * The backend derives the actor identity from the access token.
 * No actorUserId is sent by the frontend.
 */
export function getRegistrationAuditLogs(
  params: AuditLogQueryParams = {},
): Promise<AuditLogListResponse> {
  return apiRequest<AuditLogListResponse>(
    `/api/audit-logs/registration${buildAuditLogQuery(params)}`,
  );
}
