export type AuditCategory =
  | "Authentication"
  | "User Management"
  | "Integration"
  | "Data Quality"
  | "System";

export type AuditOutcome = "Success" | "Warning" | "Failed";

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  category: AuditCategory;
  outcome: AuditOutcome;
  resource: string;
  resourceId: string;
  ipAddress: string;
  details: string;
}
