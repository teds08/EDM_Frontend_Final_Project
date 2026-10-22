export type UserRole =
  | "Administrator"
  | "Registration Staff"
  | "Laboratory Staff"
  | "Billing Staff";

export type UserStatus = "Active" | "Inactive";

export type ApiUserRole = "ADMIN" | "REGISTRATION" | "LABORATORY" | "BILLING";

export type ApiUserStatus = "ACTIVE" | "INACTIVE";

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

export interface BackendAdminUser {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  lastActivity?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface UserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  password?: string;
}

export interface UserListResponse {
  success?: boolean;
  message?: string;
  data: BackendAdminUser[];
  total?: number;
  active?: number;
  inactive?: number;
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    totalItems?: number;
    totalPages?: number;
  };
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: ApiUserRole;
}

export interface UpdateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  role: ApiUserRole;
}

export interface UpdateUserStatusPayload {
  status: ApiUserStatus;
}
