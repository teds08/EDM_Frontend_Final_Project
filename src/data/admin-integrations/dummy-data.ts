import type { Integration } from "@/types/admin-integrations/integration";

export const initialIntegrations: Integration[] = [
  {
    id: "INT-001",
    name: "Electronic Medical Records",
    acronym: "EMR",
    description: "Patient demographics and encounter information.",
    status: "Connected",
    lastSynced: "Oct 22, 2026, 10:42 AM",
    recordsSynced: 1248,
    endpoint: "Demo EMR connector",
    dataFlow: "Patient demographics, encounters, and clinical summaries",
    lastChecked: "Oct 22, 2026, 10:45 AM",
    lastMessage:
      "Sample connector is marked as connected. No external service is attached.",
  },
  {
    id: "INT-002",
    name: "Laboratory Information System",
    acronym: "LIS",
    description: "Laboratory orders, test results, and specimen records.",
    status: "Connected",
    lastSynced: "Oct 22, 2026, 10:38 AM",
    recordsSynced: 863,
    endpoint: "Demo LIS connector",
    dataFlow: "Laboratory orders, specimen details, and test results",
    lastChecked: "Oct 22, 2026, 10:40 AM",
    lastMessage:
      "Sample connector is marked as connected. No external service is attached.",
  },
  {
    id: "INT-003",
    name: "Billing System",
    acronym: "Billing",
    description: "Patient invoices, payments, and billing records.",
    status: "Error",
    lastSynced: "Oct 21, 2026, 3:24 PM",
    recordsSynced: 426,
    endpoint: "Demo billing connector",
    dataFlow: "Invoices, payment records, and billing summaries",
    lastChecked: "Oct 22, 2026, 9:15 AM",
    lastMessage:
      "Sample error state for demonstration. No live billing system was contacted.",
  },
  {
    id: "INT-004",
    name: "Insurance System",
    acronym: "Insurance",
    description: "Insurance eligibility and claims information.",
    status: "Disconnected",
    lastSynced: "Never",
    recordsSynced: 0,
    endpoint: "Demo insurance connector",
    dataFlow: "Insurance eligibility, coverage, and claim status",
    lastChecked: "Not checked",
    lastMessage:
      "No live insurance connector is configured in this demonstration.",
  },
];
