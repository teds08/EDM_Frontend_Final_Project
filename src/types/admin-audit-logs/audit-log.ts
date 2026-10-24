export type AuditActorRole =
  | "ADMIN"
  | "REGISTRATION"
  | "LABORATORY"
  | "BILLING";

export type AuditOutcome = "SUCCESS";

export interface AuditLog {
  id: number;
  actorUserId: number;
  actorName: string;
  actorRole: AuditActorRole;
  action: string;
  resourceType: string;
  resourceId: number;
  outcome: AuditOutcome;
  details: string;
  createdAt: string;
}

export interface AuditLogPagination {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
}

export interface AuditLogListResponse {
  success: boolean;
  message: string;
  data: AuditLog[];
  pagination: AuditLogPagination;
}

export interface AuditLogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  resourceType?: string;
  actorRole?: AuditActorRole;
  outcome?: AuditOutcome;
  startDate?: string;
  endDate?: string;
}
