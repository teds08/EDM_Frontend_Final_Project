import type { AuditLog } from "@/types/admin-audit-logs/audit-log";

export const initialAuditLogs: AuditLog[] = [
  {
    id: "LOG-1001",
    timestamp: "Oct 22, 2026, 1:51 PM",
    actor: "Admin User",
    role: "Administrator",
    action: "Updated user account",
    category: "User Management",
    outcome: "Success",
    resource: "Teddy Antepuesto",
    resourceId: "USR-004",
    details:
      "The administrator updated the account information for Teddy Antepuesto.",
  },
  {
    id: "LOG-1002",
    timestamp: "Oct 22, 2026, 1:50 PM",
    actor: "Admin User",
    role: "Administrator",
    action: "Updated user account",
    category: "User Management",
    outcome: "Success",
    resource: "Janet Doe",
    resourceId: "USR-005",
    details:
      "The administrator modified the staff account information for Janet Doe.",
  },
  {
    id: "LOG-1003",
    timestamp: "Oct 22, 2026, 10:42 AM",
    actor: "Mia Santos",
    role: "Registration Staff",
    action: "Updated patient profile",
    category: "Registration",
    outcome: "Success",
    resource: "Olivia Santos",
    resourceId: "PAT-0001",
    details:
      "The registration staff member updated the patient profile for Olivia Santos.",
  },
  {
    id: "LOG-1004",
    timestamp: "Oct 22, 2026, 10:35 AM",
    actor: "Daniel Reyes",
    role: "Laboratory Staff",
    action: "Entered laboratory result",
    category: "Laboratory",
    outcome: "Success",
    resource: "Miguel Reyes",
    resourceId: "LAB-0208",
    details:
      "The laboratory staff member recorded a laboratory test result associated with Miguel Reyes.",
  },
  {
    id: "LOG-1005",
    timestamp: "Oct 22, 2026, 10:27 AM",
    actor: "Alyssa Cruz",
    role: "Billing Staff",
    action: "Recorded invoice payment",
    category: "Billing",
    outcome: "Success",
    resource: "Sophia Cruz",
    resourceId: "INV-0112",
    details:
      "The billing staff member recorded a payment for Sophia Cruz's invoice INV-0112.",
  },
];
