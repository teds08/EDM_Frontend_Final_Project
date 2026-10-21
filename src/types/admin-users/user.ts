export type UserRole =
  | "Administrator"
  | "Registration Staff"
  | "Laboratory Staff"
  | "Billing Staff";

export type UserStatus = "Active" | "Inactive";

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastActivity: string;
  createdAt: string;
}
