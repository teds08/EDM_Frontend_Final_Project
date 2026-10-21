export type DemoRole = "admin" | "registration" | "laboratory" | "billing";

export interface DemoUser {
  name: string;
  email: string;
  password: string;
  role: DemoRole;
  roleLabel: string;
  dashboardPath: string;
}

export const demoUsers: DemoUser[] = [
  {
    name: "Alex Morgan",
    email: "admin@carebridge.demo",
    password: "Demo123!",
    role: "admin",
    roleLabel: "Administrator",
    dashboardPath: "/admin/dashboard",
  },
  {
    name: "Mia Santos",
    email: "registration@carebridge.demo",
    password: "Demo123!",
    role: "registration",
    roleLabel: "Registration Staff",
    dashboardPath: "/registration/dashboard",
  },
  {
    name: "Daniel Reyes",
    email: "laboratory@carebridge.demo",
    password: "Demo123!",
    role: "laboratory",
    roleLabel: "Laboratory Staff",
    dashboardPath: "/laboratory/dashboard",
  },
  {
    name: "Alyssa Cruz",
    email: "billing@carebridge.demo",
    password: "Demo123!",
    role: "billing",
    roleLabel: "Billing Staff",
    dashboardPath: "/billing/dashboard",
  },
];
