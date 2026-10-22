export type RegistrationStatus = "Complete" | "Pending Review" | "Incomplete";

export type Gender =
  | "Female"
  | "Male"
  | "Non-binary"
  | "Other"
  | "Prefer not to say";

export type Religion =
  | "Catholic"
  | "Christian"
  | "Islam"
  | "Iglesia ni Cristo"
  | "Other"
  | "Prefer not to say";

export type CivilStatus =
  | "Single"
  | "Married"
  | "Widowed"
  | "Separated"
  | "Divorced"
  | "Prefer not to say";

export interface PatientRegistration {
  id: string;
  patientId: string;
  fullName: string;
  email: string;
  contactNumber: string;
  address: string;
  gender: Gender;
  religion: Religion;
  civilStatus: CivilStatus;
  registeredAt: string;
  status: RegistrationStatus;
}

export interface RegistrationDashboardStats {
  totalPatients: number;
  registeredToday: number;
  pendingRecords: number;
  updatedToday: number;
}
