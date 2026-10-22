export type AuditOutcome = "Success" | "Warning" | "Failed";

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  category: string;
  outcome: AuditOutcome;
  resource: string;
  resourceId: string;
  details: string;
}
