export const adminDashboardData = {
  stats: [
    {
      id: "patients",
      title: "Registered Patients",
      value: "1,284",
      description: "Total demo patient records",
      icon: "patients",
    },
    {
      id: "orders",
      title: "Lab Orders Today",
      value: "42",
      description: "Sample orders for today",
      icon: "orders",
    },
    {
      id: "invoices",
      title: "Unpaid Invoices",
      value: "18",
      description: "₱24,650 outstanding",
      icon: "invoices",
    },
    {
      id: "quality",
      title: "Data Quality Issues",
      value: "7",
      description: "3 records need review",
      icon: "quality",
    },
  ],

  sources: [
    {
      name: "EMR",
      description: "Patient records",
      status: "Simulated",
    },
    {
      name: "LIS",
      description: "Laboratory orders and results",
      status: "Simulated",
    },
    {
      name: "Billing",
      description: "Invoices and payments",
      status: "Simulated",
    },
    {
      name: "Insurance",
      description: "Insurance reference records",
      status: "Manual entry",
    },
  ],

  qualityIssues: [
    {
      id: "DQ-001",
      title: "Possible duplicate patients",
      count: 3,
      description: "Records require staff review.",
    },
    {
      id: "DQ-002",
      title: "Invalid patient references",
      count: 2,
      description: "Laboratory records with invalid patient IDs.",
    },
    {
      id: "DQ-003",
      title: "Timestamp inconsistencies",
      count: 2,
      description: "Records require timestamp validation.",
    },
  ],

  activities: [
    {
      id: "ACT-001",
      action: "Patient profile updated",
      user: "Mia Santos",
      role: "Registration Staff",
      record: "PAT-0001",
      time: "10:42 AM",
      status: "Success",
    },
    {
      id: "ACT-002",
      action: "Laboratory result entered",
      user: "Daniel Reyes",
      role: "Laboratory Staff",
      record: "LAB-0208",
      time: "10:35 AM",
      status: "Success",
    },
    {
      id: "ACT-003",
      action: "Invoice payment recorded",
      user: "Alyssa Cruz",
      role: "Billing Staff",
      record: "INV-0112",
      time: "10:27 AM",
      status: "Success",
    },
    {
      id: "ACT-004",
      action: "Possible duplicate detected",
      user: "System Validation",
      role: "Data Quality",
      record: "PAT-0044",
      time: "10:12 AM",
      status: "Review",
    },
  ],

  weeklyOrders: [
    { day: "Mon", count: 29 },
    { day: "Tue", count: 35 },
    { day: "Wed", count: 42 },
    { day: "Thu", count: 33 },
    { day: "Fri", count: 47 },
    { day: "Sat", count: 24 },
    { day: "Sun", count: 18 },
  ],
};
